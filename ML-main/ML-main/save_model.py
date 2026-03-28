import tensorflow as tf

model = tf.keras.models.load_model('model/tuned_ann_model.h5')
model.export('app/models/ann/1')