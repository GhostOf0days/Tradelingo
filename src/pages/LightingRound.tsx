import '../styles/LightingRound.css';

export default function LightingRound() {
  return (
    <div className="lighting-round">
      <div className="lighting-round__container">
        <div className="lighting-round__header">
          <h1>⚡ Lightning Round</h1>
          <p>Coming Soon!</p>
        </div>

        <div className="lighting-round__content">
          <div className="lighting-round__icon">
            <span>⚡</span>
          </div>
          <h2>Lightning Round Challenge</h2>
          <p>
            Get ready for the fastest way to test your investment knowledge! Lightning Round will feature
            rapid-fire questions with limited time to answer. Challenge yourself and see how many you can
            get right before time runs out.
          </p>

          <div className="lighting-round__features">
            <h3>What to Expect:</h3>
            <ul>
              <li>⏱️ 10 seconds per question</li>
              <li>🎯 25 rapid-fire questions</li>
              <li>🏆 Leaderboard rankings</li>
              <li>🌟 Bonus XP multiplier (2x for perfect rounds)</li>
              <li>🔥 Daily challenges</li>
            </ul>
          </div>

          <div className="lighting-round__coming-soon">
            <p>🚀 Launching Soon</p>
            <p className="lighting-round__subtitle">Stay tuned for the most intense trading challenge yet!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
