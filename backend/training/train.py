"""
Solanum Scan — CNN Training Script
Trains a MobileNetV2-based transfer learning model on PlantVillage potato dataset.

Usage:
    python train.py

The dataset is expected in: ./data/PlantVillage/
  ├── Potato___Early_blight/
  ├── Potato___Late_blight/
  └── Potato___healthy/

Download dataset from:
  https://www.kaggle.com/datasets/arjuntejaswi/plant-village
  Or: https://github.com/spMohanty/PlantVillage-Dataset
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.applications import MobileNetV2

# ─── Config ───────────────────────────────────────────────────────────────────

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 1e-4
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "PlantVillage")
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "..", "model", "potato_model.h5")
CLASS_NAMES = ["Early Blight", "Healthy", "Late Blight", "Tomato Bacterial Spot", "Tomato Leaf Mold"]

# Map directory names → clean class names
CLASS_MAP = {
    "Potato___Early_blight": "Early Blight",
    "Potato___healthy": "Healthy",
    "Potato___Late_blight": "Late Blight",
    "Tomato___Bacterial_spot": "Tomato Bacterial Spot",
    "Tomato___Leaf_Mold": "Tomato Leaf Mold",
}

# ─── Data Pipeline ────────────────────────────────────────────────────────────

def build_data_generators():
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.15,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.8, 1.2],
        validation_split=0.2,
    )

    val_datagen = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2)

    train_gen = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="training",
        shuffle=True,
    )

    val_gen = val_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
    )

    return train_gen, val_gen


# ─── Model Architecture ───────────────────────────────────────────────────────

def build_model(num_classes: int = 5) -> tf.keras.Model:
    """
    MobileNetV2-based transfer learning model.
    Uses ImageNet pretrained weights, fine-tuned for potato disease classification.
    """
    base = MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    # Freeze base layers initially
    base.trainable = False

    model = models.Sequential([
        base,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.4),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation="softmax"),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ─── Training ─────────────────────────────────────────────────────────────────

def train():
    print("=" * 60)
    print("  Solanum Scan — CNN Training")
    print("=" * 60)
    print(f"  Dataset: {DATA_DIR}")
    print(f"  Model output: {MODEL_SAVE_PATH}")
    print(f"  TensorFlow version: {tf.__version__}")
    print("=" * 60)

    if not os.path.exists(DATA_DIR):
        raise FileNotFoundError(
            f"Dataset not found at {DATA_DIR}\n"
            "Download PlantVillage potato subset and place it there."
        )

    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)

    train_gen, val_gen = build_data_generators()
    print(f"\nClasses found: {train_gen.class_indices}")
    print(f"Training samples: {train_gen.samples}")
    print(f"Validation samples: {val_gen.samples}\n")

    model = build_model(num_classes=len(train_gen.class_indices))
    model.summary()

    callbacks = [
        EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),
        ModelCheckpoint(
            MODEL_SAVE_PATH,
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=3,
            verbose=1,
            min_lr=1e-7,
        ),
    ]

    print("\n[Phase 1] Training classification head (base frozen)...")
    history = model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=callbacks,
    )

    # Fine-tuning: unfreeze top layers of base
    print("\n[Phase 2] Fine-tuning top layers of MobileNetV2...")
    base_model = model.layers[0]
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    history_ft = model.fit(
        train_gen,
        epochs=10,
        validation_data=val_gen,
        callbacks=callbacks,
    )

    # Final evaluation
    print("\n" + "=" * 60)
    val_loss, val_acc = model.evaluate(val_gen)
    print(f"  Final Validation Accuracy: {val_acc:.4f} ({val_acc*100:.2f}%)")
    print(f"  Final Validation Loss:     {val_loss:.4f}")
    print(f"  Model saved to: {MODEL_SAVE_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    train()
