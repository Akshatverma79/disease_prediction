import axios from "axios";
import { PredictResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000
});

export async function fetchSymptoms(): Promise<string[]> {
  const response = await client.get<{ symptoms: string[] }>("/symptoms");
  return response.data.symptoms;
}

export async function predictDiseases(symptoms: string[]): Promise<PredictResponse> {
  const response = await client.post<PredictResponse>("/predict", { symptoms });
  return response.data;
}
