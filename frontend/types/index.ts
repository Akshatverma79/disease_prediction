export type Prediction = {
  disease: string;
  confidence: number;
};

export type PredictResponse = {
  predictions: Prediction[];
  disclaimer: string;
};

export type HistoryItem = {
  id: string;
  timestamp: string;
  symptoms: string[];
  predictions: Prediction[];
};
