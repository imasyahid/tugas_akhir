import joblib
import numpy as np

class DiabetesPreprocessor:
  def __init__(self, min_age, max_age, min_HbA1c, max_HbA1c, min_glucose, max_glucose):
    self.min_age = min_age
    self.max_age = max_age
    self.min_HbA1c = min_HbA1c
    self.max_HbA1c = max_HbA1c
    self.min_glucose = min_glucose
    self.max_glucose = max_glucose

    self.gender_mapping = {'Male': 1, 'Female': 0}
    self.bmi_mapping = {
      'Underweight': 0, 'Normal': 1, 'Overweight': 2,
      'Obese Class I': 3, 'Obese Class II': 4
    }

  def process(self, gender, smoke, age, bmi, HbA1c, glucose):
    # gender
    gender_mapped = self.gender_mapping[gender]

    # smoke
    smoke_mapping = {
      'Yes': [1, 0, 0],
      'No': [0, 1, 0],
      'Unknown': [0, 0, 1]
    }
    smoke_mapped = np.array(smoke_mapping.get(smoke, [0, 0, 0])).astype("int32")

    if len(smoke_mapped) != 3:
      raise ValueError("Invalid smoke input. Must be Yes, No, or Unknown.")

    # age
    age_normalized = (age - self.min_age) / (self.max_age - self.min_age)

    # bmi binning
    if bmi > 0 and bmi <= 18.5:
      bmi_binned = 'Underweight'
    elif bmi <= 22.9:
      bmi_binned = 'Normal'
    elif bmi <= 24.9:
      bmi_binned = 'Overweight'
    elif bmi <= 29.9:
      bmi_binned = 'Obese Class I'
    else:
      bmi_binned = 'Obese Class II'

    bmi_mapped = self.bmi_mapping[bmi_binned]
    bmi_normalized = (bmi_mapped - 0) / (4 - 0)

    # HbA1c
    HbA1c_normalized = (HbA1c - self.min_HbA1c) / (self.max_HbA1c - self.min_HbA1c)

    # glucose
    glucose_log = np.log(glucose)
    glucose_normalized = (glucose_log - self.min_glucose) / (self.max_glucose - self.min_glucose)

    # Concatenate all features
    final_input = np.concatenate((
      [gender_mapped, age_normalized, bmi_normalized, HbA1c_normalized, glucose_normalized],
      smoke_mapped
    )).astype(np.float32)

    return final_input
  
preprocessor = DiabetesPreprocessor(
    min_age=0.08, max_age=80.00,
    min_HbA1c=3.50, max_HbA1c=9.00,
    min_glucose=np.log(80.00), max_glucose=np.log(300.00)
) 

joblib.dump(preprocessor, "preprocessor.pkl")