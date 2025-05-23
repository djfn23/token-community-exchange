import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBalance(null);
    try {
      const res = await fetch(
        `http://localhost:3001/balance/${encodeURIComponent(address)}`
      );
      if (!res.ok) throw new Error("Adresse invalide ou API indisponible");
      const data = await res.json();
      setBalance(data.balance);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, margin: "3rem auto", padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>TokenChain Explorer</h1>
      <form onSubmit={fetchBalance} style={{ marginBottom: 32 }}>
        <label htmlFor="address">Adresse Substrate :</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="5FHne..."
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
          required
        />
        <button type="submit" disabled={loading || !address} style={{ padding: 8 }}>
          {loading ? "Recherche..." : "Obtenir le solde"}
        </button>
      </form>
      {balance !== null && (
        <div style={{ fontSize: 20, marginBottom: 16 }}>
          <b>Solde community-token :</b> {balance}
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <hr style={{ margin: "32px 0" }} />
      <p style={{ fontSize: 14, color: "#555" }}>
        Cette interface interroge l’API REST <code>TokenChain</code>.<br />
        <b>Astuce :</b> Lancez <code>npm start</code> dans <code>tokenchain-node/api</code>.<br />
        Code source sur <a href="https://github.com/" target="_blank">GitHub</a>.
      </p>
    </main>
  );
}

            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
