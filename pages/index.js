
import Head from "next/head";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://sdk.minepi.com/pi-sdk.js";
  script.async = true;

  script.onload = async () => {
    try {
      window.Pi.init({
        version: "2.0",
        sandbox: false,
      });

      await window.Pi.authenticate(
        ["username", "payments"],
        (payment) => {
          console.log("Incomplete payment:", payment);
        }
      );

      console.log("Pi SDK ready");
    } catch (error) {
      console.error("Pi authentication error:", error);
    }
  };

  document.body.appendChild(script);

  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
}, []);
  const handlePiPayment = () => {
  if (!window.Pi) {
    alert("Pi SDK belum ready. Sila buka app dalam Pi Browser.");
    return;
  }

  window.Pi.createPayment(
    {
      amount: 0.01,
      memo: "MathSpark Kids Testnet access",
      metadata: {
        product: "mathspark-kids-access",
      },
    },
    {
      onReadyForServerApproval: async (paymentId) => {
        await fetch("/api/approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId }),
        });
      },

      onReadyForServerCompletion: async (paymentId, txid) => {
        await fetch("/api/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId, txid }),
        });

        alert("Payment completed!");
      },

      onCancel: (paymentId) => {
        console.log("Payment cancelled:", paymentId);
      },

      onError: (error) => {
        console.error("Payment error:", error);
        alert("Payment error. Please try again.");
      },
    }
  );
};
  return (
    <>
      <Head>
        <title>MathSpark Kids</title>
        <meta
          name="description"
          content="Fun and interactive math learning for kids under 12"
        />
      </Head>

      <main className="page">
        <nav className="nav">
          <div className="logo">⚡ MathSpark Kids</div>
          <div className="badge">Pi Testnet</div>
        </nav>

        <section className="hero">
          <div className="content">
            <span className="tag">Math learning for kids under 12</span>

            <h1>
              Learn Math.
              <br />
              <span>Spark the Future!</span>
            </h1>

            <p>
              Fun, interactive and easy math learning with lessons,
              quizzes and rewards.
            </p>

            <div className="card">
              <div className="price">Full Access • $6 USD</div>
              <button onClick={handlePiPayment}>
  ⚡ Buy Access with Pi
</button>
              <small>Payment using Pi Network</small>
            </div>
          </div>

          <div className="mathArea">
            <div className="question">5 + 3 = ?</div>
            <div className="shape one"></div>
            <div className="shape two"></div>
            <div className="shape three"></div>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #16004d, #4014c7, #6c32e8);
          color: white;
          font-family: Arial, sans-serif;
          overflow: hidden;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 7%;
        }

        .logo {
          font-weight: 800;
          font-size: 20px;
        }

        .badge {
          background: #ffd84d;
          color: #2b1748;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .hero {
          min-height: 82vh;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 30px;
          padding: 30px 8%;
        }

        .tag {
          background: #ffe35b;
          color: #382060;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
        }

        h1 {
          font-size: clamp(48px, 7vw, 90px);
          line-height: 0.95;
          margin: 25px 0;
        }

        h1 span {
          color: #ffd92f;
        }

        p {
          max-width: 520px;
          line-height: 1.6;
          color: #e4ddff;
        }

        .card {
          margin-top: 30px;
          max-width: 390px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 18px;
        }

        .price {
          font-weight: bold;
          margin-bottom: 12px;
        }

        button {
          width: 100%;
          border: 0;
          padding: 15px;
          border-radius: 10px;
          background: white;
          color: #3b177c;
          font-weight: 800;
          cursor: pointer;
        }

        small {
          display: block;
          margin-top: 10px;
          text-align: center;
          opacity: 0.75;
        }

        .mathArea {
          position: relative;
          height: 430px;
        }

        .question {
          position: absolute;
          top: 60px;
          left: 10%;
          background: white;
          color: #351472;
          padding: 18px 25px;
          border-radius: 15px;
          font-size: 28px;
          font-weight: bold;
          transform: rotate(-4deg);
        }

        .shape {
          position: absolute;
          background: white;
          border-radius: 18px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .one {
          width: 105px;
          height: 130px;
          right: 15%;
          top: 80px;
        }

        .two {
          width: 65px;
          height: 85px;
          left: 25%;
          bottom: 70px;
        }

        .three {
          width: 75px;
          height: 100px;
          right: 25%;
          bottom: 30px;
        }

        @media (max-width: 750px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 50px;
          }

          .mathArea {
            height: 280px;
          }

          h1 {
            font-size: 52px;
          }
        }
      `}</style>
    </>
  );
}
