import { isEqual } from "lodash";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import useDb from "../hooks/useDb";
import NotFound from "./NotFound";


function ResultFinal() {
  const { id } = useParams();

  const mydb = useDb();

  const exam = useMemo(() => {
    if (!id || !mydb) return null;
    return mydb
      .get(process.env.REACT_APP_DB_NAME)
      .find({
        id,
      })
      .value();
  }, [id, mydb]);

  if (!exam)
    return (
      <Layout margin>
        <Header title="Wait.." />
      </Layout>
    );

  if (!id) return <NotFound />;
  return (
    <Layout margin>
      <Header title="Compelete" />

      <div className="practice-content box-content">
        

        <div className="exam-result">
          {/* <Particles
            width="320px"
            height="320px"
            params={{
              particles: {
                number: {
                  value: 16,
                  density: {
                    enable: true,
                    value_area: 100,
                  },
                },
              },
            }}
          /> */}
          <h3>Résultat De l'Examen</h3>
          <span className="span-label">nombre de questions:</span>{" "}
          <span> {exam.total}</span>
          <span className="span-label">les bonnes réponses</span>
          <span>
            {exam.list.filter((q) => isEqual(q.answers, q.valid)).length}
          </span>
        </div>

        <div className="leftbar-container">
          <div>
            <span> List of all questions! ici </span>
            <input type="checkbox" />

            <ul>
              {exam.list.map((q, index) => (
                <li
                  className={[  isEqual(q.answers, q.valid) ? "valid":"wrong" ,q.answers ? "hasAnswers" : ""].join(" ")}
                  key={q.id}
                >
                  <Link to={`/practice/${exam.id}/${index}`}>
                    {q.question.substr(0, 32)}..
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>


      </div>
    </Layout>
  );
}

export default ResultFinal;
