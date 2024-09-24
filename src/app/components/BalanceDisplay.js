export default function BalanceDisplay({ cashBalance, onlineBalance }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold">Balance</h2>
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg">Cash Balance</h3>
          <p>₹{cashBalance.toFixed(2)}</p>
        </div>
        <div>
          <h3 className="text-lg">Online Balance</h3>
          <p>₹{onlineBalance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
