
import Head from "next/head";
import { useEffect, useState } from "react";
export default function Home() { 
  const [isPremium, setIsPremium] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [feedback, setFeedback] = useState("");

const questions = [
  {
    question: "5 + 3",
    answers: [8, 7, 9],
    correct: 8,
  },
  {
    question: "6 + 4",
    answers: [9, 10, 11],
    correct: 10,
  },
  {
    question: "7 + 2",
    answers: [8, 9, 10],
    correct: 9,
  },
  {
    question: "4 + 5",
    answers: [9, 8, 10],
    correct: 9,
  },
  {
    question: "8 + 3",
    answers: [10, 11, 12],
    correct: 11,
  },
];
  const handleAnswer = (answer) => {
  if (answer === questions[currentQuestion].correct) {
    setScore(score + 1);
    setFeedback("Correct! 🎉");

    setTimeout(() => {
      setFeedback("");

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setFeedback("Quiz Complete! 🏆");
      }
    }, 800);
  } else {
    setFeedback("Try again 😊");
  }
};
  useEffect(() => {
  const existingScript = document.querySelector(
    'script[src="https://sdk.minepi.com/pi-sdk.js"]'
  );

  const initPi = () => {
    if (window.Pi) {
      window.Pi.init({
        version: "2.0",
      });

      console.log("Pi SDK initialized");
    }
  };

  if (existingScript) {
    initPi();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://sdk.minepi.com/pi-sdk.js";
  script.async = true;
  script.onload = initPi;
  script.onerror = () => {
    console.error("Failed to load Pi SDK");
  };

  document.body.appendChild(script);
}, []);

const handlePiPayment = async () => {

  if (!window.Pi) {
    alert("Pi SDK not loaded. Please open this app in Pi Browser.");
    return;
  }

  try {
    const auth = await window.Pi.authenticate(
      ["username", "payments"],
      async (payment) => {
        console.log("Incomplete payment found:", payment);

        if (payment?.identifier && payment?.transaction?.txid) {
          await fetch("/api/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId: payment.identifier,
              txid: payment.transaction.txid,
            }),
          });
        }
      }
    );
const premiumResponse = await fetch(
  `/api/premium?uid=${encodeURIComponent(auth.user.uid)}`
);

const premiumResult = await premiumResponse.json();

if (premiumResponse.ok && premiumResult.premium) {
  setIsPremium(true);
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
          const response = await fetch("/api/approve", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId,
            }),
          });

          if (!response.ok) {
            alert("Server approval failed");
          }
        },

        onReadyForServerCompletion: async (paymentId, txid) => {
          const response = await fetch("/api/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentId,
              txid,
            }),
          });

          if (response.ok) {
            setIsPremium(true);
          } else {
            alert("Payment completion failed");
          }
        },

        onCancel: (paymentId) => {
          console.log("Payment cancelled:", paymentId);
        },

        onError: (error) => {
          console.error("Payment error:", error);
          alert(
            "Payment error: " +
              (error?.message || JSON.stringify(error))
          );
        },
      }
    );
  } catch (error) {
    console.error("Pi authentication error:", error);

    alert(
      "Authentication error: " +
        (error?.message || JSON.stringify(error))
    );
  }
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
  {isPremium ? (
    <>
      <div className="price">✅ Full Access Unlocked</div>
      <small>Thank you! Premium content is now available.</small>
    </>
  ) : (
    <>
      <div className="price">Full Access • $6 USD</div>
      <button onClick={handlePiPayment}>
        ⚡ Buy Access with Pi
      </button>
      <small>Payment using Pi Network</small>
    </>
  )}
</div>
          </div>

          {isPremium ? (
  <div className="premiumLearningArea">
    <h2 className="premiumTitle">⭐ Premium Learning Area</h2>

    <div className="premiumBox">
      <h2>Lesson 1: Addition</h2>
      <p>Let&apos;s learn simple addition.</p>

      <div className="quizCard">
        <div className="quizQuestion">
          {questions[currentQuestion].question} = ?
        </div>

        <button
          className="answerButton"
          onClick={() =>
            handleAnswer(questions[currentQuestion].answers[0])
          }
        >
          {questions[currentQuestion].answers[0]}
        </button>

        <button
          className="answerButton"
          onClick={() =>
            handleAnswer(questions[currentQuestion].answers[1])
          }
        >
          {questions[currentQuestion].answers[1]}
        </button>

        <button
          className="answerButton"
          onClick={() =>
            handleAnswer(questions[currentQuestion].answers[2])
          }
        >
          {questions[currentQuestion].answers[2]}
        </button>
      </div>
    </div>
  </div>
) : (
  <div className="premiumLearningArea">
    <h2>🔒 Premium Content Locked</h2>
    <p>Buy Full Access to unlock lessons and quizzes.</p>
  </div>
)}
    
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
        }.premiumLearningArea {
  margin-top: 40px;
  padding: 30px 20px;
  text-align: center;
}

.premiumTitle {
  font-size: 28px;
  margin-bottom: 24px;
}

.premiumBox {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 24px;
}

.quizCard {
  margin-top: 24px;
  background: white;
  color: #3b167d;
  border-radius: 22px;
  padding: 24px;
}

.quizQuestion {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 20px;
}

.answerButton {
  width: 100%;
  margin: 8px 0;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
          }
      `}</style>
    </>
  );
}
