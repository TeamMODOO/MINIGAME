type ScoreProps = {
    score: number;
    level: number;
  };
  
  const Score: React.FC<ScoreProps> = ({ score, level }) => {
    return (
      <div>
        <p>Score: {score}</p>
        <p>Level: {level}</p>
      </div>
    );
  };
  
  export default Score;
  