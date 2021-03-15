import { get, isEqual } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaCheckSquare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  ListGroupItem,
  Label,
  FormGroup,
  Input,
  ListGroup,
} from "reactstrap";
import Header from "../components/Header";
import Layout from "../components/Layout";
import useDb from "../hooks/useDb";

function Practice() {
  const mydb = useDb();
  const { id, progress } = useParams();
  const [exam, setExam] = useState(null);
  const [position, setPosition] = useState(-1);
  const [qcm, setQcm] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const { user, connected } = useSelector((state) => state.appReducer);

  useEffect(() => {
    if (id && mydb) {
      let exam = mydb
        .get(process.env.REACT_APP_DB_NAME)
        .find({
          id,
        })
        .value();

      console.log("exam", exam);

      if (exam) {
        setExam(exam);
        
        let currentPosition =
          typeof progress != "undefined" ? parseInt(progress) : exam.progress;

        setPosition(currentPosition);
      }
    }
  }, [mydb, id]);

  const toggleAnswers = () => setShowAnswer(!showAnswer);
  useEffect(() => {
    setShowAnswer(false);
    if (exam) {
      setQcm(exam.list[position]);

      mydb
        .get(process.env.REACT_APP_DB_NAME)
        .find({
          id: exam.id,
        })
        .update(`progress`, (p) => Math.max(p, position))
        .write();
    }
  }, [position]);

  useEffect(() => {
    if (qcm) {
      setAnswers(qcm.valid);
      if (get(exam, `list[${position}].answers`, null)) {
        setUserAnswers(exam.list[position].answers);
      } else {
        setUserAnswers(new Array(qcm.valid.length).fill(false));
      }
    }
  }, [qcm]);

  const getValid = (index) => {
    if (qcm.valid[index]) {
      return "1";
    } else if (!qcm.valid[index] && userAnswers[index]) {
      return "0";
    }
  };

  const checkAnswer = (index) => {
    let t = userAnswers;
    t[index] = !t[index];
    saveUserAnswers();
    setUserAnswers([...t]);
  };

  const isChecked = (index) => {
    return userAnswers[index];
  };

  const goNext = () => {
    setPosition(position + 1);
  };

  const goPrev = () => {
    setPosition(position - 1);
  };

  const saveUserAnswers = () => {
    mydb
      .get(process.env.REACT_APP_DB_NAME)
      .find({
        id: exam.id,
      })
      .set(`list[${position}].answers`, userAnswers)
      .write();
  };

  const isEnd = useMemo(() => exam && position == exam.total - 1, [position]);

  if (!exam)
    return (
      <Layout margin>
        <Header title="Wait.." />
      </Layout>
    );

  return (
    <Layout margin>
      <Header title="Examen" />

      <div className="practice-content box-content">
        <div className="leftbar-container">
          <div>
            <span> - Toutes les questions </span>
            <input type="checkbox" />

            <ul>
              {exam.list.map((q, index) => (
                <li
                  onClick={() => setPosition(index)}
                  className={[
                    position == index ? "currentQ" : "",
                    q.answers ? "hasAnswers" : "",
                  ].join(" ")}
                  key={q.id}
                >
                  {q.question.substr(0, 32)}..
                </li>
              ))}
            </ul>
          </div>
        </div>

        {qcm && (
          <div className="qcm">
            <div className="question">
              <Button
                outline
                color="warning"
                disabled={position == 0}
                onClick={goPrev}
              >
                <FaArrowAltCircleLeft />
              </Button>

              <span>{qcm.question}</span>

              {!isEnd && (
                <Button
                  outline
                  color="warning"
                  //disabled={isEnd}
                  onClick={goNext}
                >
                  <FaArrowAltCircleRight />
                </Button>
              )}

              {isEnd && (
                <Button itemType="a" href={`/#/result/${exam.id}`} color="info">
                  <FaCheckSquare />
                </Button>
              )}
            </div>

            <div className="note-img">
              <p className="note">{qcm.note}</p>
              {qcm.imageUrl && (
                <img
                  title={qcm.question}
                  id={`i-${qcm.id}`}
                  key={qcm.id}
                  onClick={() => window.open(qcm.imageUrl)}
                  src={qcm.imageUrl}
                />
              )}
            </div>

            <div className="practice-suggestions">
              <ListGroup>
                {qcm.suggestions.map((sug, index) => (
                  <ListGroupItem
                    key={`sug-${index}`}
                    className="sug-group"
                    {...(showAnswer ? { valid: getValid(index) } : {})}
                  >
                    <FormGroup check className="p">
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={isChecked(index)}
                          onClick={() => checkAnswer(index)}
                        />
                        {sug}
                      </Label>
                    </FormGroup>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>

            <div className="footer">
              <Button onClick={toggleAnswers} color="success" size="sm">
                comparez la réponse
              </Button>
              <span>
                {position + 1} / {exam.total}
              </span>

              {connected && user && user.role == "admin" && (
                <Link
                  title="pour les admins"
                  target="_blank"
                  to={`/qcm/${qcm.id}`}
                >
                  Editer
                </Link>
              )}
              <Input
                type="number"
                min={1}
                max={exam.total}
                value={position + 1}
                onChange={(e) => {
                  let v = parseInt(e.target.value);
                  v = Math.max(1, v);
                  v = Math.min(exam.total, v);

                  if (isNaN(v)) return;

                  setPosition(v - 1);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Practice;
