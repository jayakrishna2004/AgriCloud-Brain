import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import PredictionCard from "../components/PredictionCard";
import PredictionChart from "../charts/PredictionChart";

function Predictions() {

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">

          <div className="page-heading">

            <h1>AI Predictions</h1>

            <p>
              AI-based agricultural workload prediction
              and scaling recommendations.
            </p>

          </div>

          <PredictionCard
            predictedLoad={74}
            confidence={91}
            recommendedInstances={7}
          />

          <PredictionChart />

          <div className="prediction-table">

            <h2>Prediction History</h2>

            <table>

              <thead>

                <tr>
                  <th>Time</th>
                  <th>Actual Load</th>
                  <th>Predicted Load</th>
                  <th>Confidence</th>
                  <th>Instances</th>
                </tr>

              </thead>

              <tbody>

                <tr>
                  <td>10:00</td>
                  <td>45%</td>
                  <td>48%</td>
                  <td>92%</td>
                  <td>4</td>
                </tr>

                <tr>
                  <td>12:00</td>
                  <td>55%</td>
                  <td>58%</td>
                  <td>94%</td>
                  <td>5</td>
                </tr>

                <tr>
                  <td>14:00</td>
                  <td>70%</td>
                  <td>74%</td>
                  <td>91%</td>
                  <td>7</td>
                </tr>

                <tr>
                  <td>16:00</td>
                  <td>65%</td>
                  <td>68%</td>
                  <td>90%</td>
                  <td>6</td>
                </tr>

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Predictions;