export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="glass-card rounded-3xl p-8">
        <h1 className="font-display text-3xl font-bold">About This Project</h1>
        <p className="mt-4 text-slate-700 dark:text-slate-200">
          This disease prediction system uses a supervised machine learning pipeline trained on a public Kaggle
          symptom-to-disease dataset. During training, multiple models are benchmarked and the best one is selected
          using weighted F1-score.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-xl font-bold">Model Pipeline</h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
            Data cleaning includes duplicate removal, missing value handling, and symptom encoding. Models compared:
            Logistic Regression, Random Forest, Gradient Boosting, and optionally XGBoost.
          </p>
        </article>

        <article className="glass-card rounded-3xl p-6">
          <h2 className="font-display text-xl font-bold">Limitations</h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
            Predictions depend on dataset quality and may not represent real-world prevalence or patient history.
            Clinical diagnosis requires licensed healthcare professionals.
          </p>
        </article>
      </div>

      <div className="glass-card rounded-3xl border-l-4 border-amber-400 p-6">
        <h2 className="font-display text-xl font-bold">Medical Disclaimer</h2>
        <p className="mt-2 font-semibold text-amber-900 dark:text-amber-200">
          This is not a medical diagnosis system.
        </p>
      </div>
    </section>
  );
}
