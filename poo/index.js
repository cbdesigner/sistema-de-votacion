// tenemos una funcion window onload que espera el contenido sea cargado
window.onload = function () {
  console.log("cargó la página");

  // tenemos una variable global que va a registrar todas las encuestas registradas
  const surveys = [];

  // mediante un evento en javascript registro cuando es agregada una nueva encuesta
  document.getElementById("newSurvey").onclick = () => {
    console.log("se ejecuta el click y agregar encuesta");
    const surveyName = document.getElementById("fsurvey").value;
    console.log(surveyName);
    // recibo el nombre y registro en mi variable global de tipo array tres datos.. id, name y questions
    surveys.push({
      id: `${Date.now()}-${surveyName.replace(/ /g, "").toLowerCase()}`,
      name: surveyName,
      questions: [],
    });

    // además, cada vez que agrego una nueva encuesta, actualizo mi lista de encuestas
    refreshSurveyList();
  };

  // tenemos una funcion que escucha cuando es agregada una nueva opcion a la pregunta
  document.getElementById("newOption").onclick = () => {
    const surveySelected = document.getElementById("surveySelect1").value;
    if (surveySelected) {
      const temporalOptionsList = document.getElementById("temporalOptions");
      if (temporalOptionsList) {
        const optionName = document.getElementById("foption").value;
        if (optionName) {
          temporalOptionsList.innerHTML += `<p>${optionName}</p>`;
          document.getElementById("foption").value = "";
        }
      }
    } // end surveySelected
  };

  // y tenemos un evento donde escuchamos cuando una pregunta es agregada
  document.getElementById("addQuestion").onclick = () => {
    const surveySelected = document.getElementById("surveySelect1").value;
    if (surveySelected) {
      const questionName = document.getElementById("fquestion").value;
      const options = document.querySelectorAll("#temporalOptions > p");
      const optionsName = [];
      for (let i = 0; i < options.length; i++) {
        const e = options[i];
        optionsName.push(e.innerText);
      }
      const indexSurvey = surveys.findIndex((e) => e.id == surveySelected);
      if (indexSurvey != -1 && questionName && optionsName.length) {
        const questions = surveys[indexSurvey].questions;
        const questionIndex = questions.findIndex(
          (ee) => ee.name == questionName
        );
        if (questionIndex != -1) {
          surveys[indexSurvey].questions[questionIndex].options.push(
            optionsName
          );
        } else {
          surveys[indexSurvey].questions.push({
            id: `${Date.now()}-${questionName.replace(/ /g, "").toLowerCase()}`,
            name: questionName,
            options: optionsName,
            responses: [],
          });
        }
      }
    } // end surveySelected
    console.log(surveys);
    document.getElementById("temporalOptions").innerHTML = "";
  };

  // funcion para escuchar cuando el usuario selecciona otra pregunta para responder
  document.getElementById("surveySelect2").onchange = () => {
    const surveySelected = document.getElementById("surveySelect2").value;
    if (surveySelected) {
      const surveyFind = surveys.find((e) => e.id == surveySelected);
      const questionBySurveyHtml = document.getElementById("questionsBySurvey");
      let questionsHtml = "";
      for (let i = 0; i < surveyFind.questions.length; i++) {
        const e = surveyFind.questions[i];
        questionsHtml += `            
              <fieldset>
                  <legend>${e.name}</legend>
                  <div id="questionBySurveyOptions" surveyname="${e.id}">`;
        for (let ii = 0; ii < e.options.length; ii++) {
          const ee = e.options[ii];
          questionsHtml += `                    
                  <input type="radio" name="${e.name}" value="${ee}" id="${ee}">
                  <label for="${ee}">${ee}</label>
                  <br>`;
        }
        questionsHtml += `</div>
              </fieldset>
              <br>`;
      }
      questionBySurveyHtml.innerHTML = questionsHtml;
    }
  };

  // funcion para escuchar cuando el usuario da click a responder
  document.getElementById("responseSurvey").onclick = () => {
    const surveySelected = document.getElementById("surveySelect2").value;
    if (surveySelected) {
      const surveyIndex = surveys.findIndex((e) => e.id == surveySelected);
      if (surveyIndex !== -1) {
        const allQuestions = document.querySelectorAll(
          "#questionBySurveyOptions"
        );
        for (let i = 0; i < allQuestions.length; i++) {
          const e = allQuestions[i];
          const questionIndex = surveys[surveyIndex].questions.findIndex(
            (j) => j.id == e.attributes.surveyname.value
          );
          if (questionIndex != -1) {
            for (let ii = 0; ii < e.children.length; ii++) {
              const ee = e.children[ii];
              if (ee.nodeName == "INPUT" && ee.checked) {
                const responsesIndex = surveys[surveyIndex].questions[
                  questionIndex
                ].responses.findIndex((l) => l.value == ee.value);
                if (responsesIndex !== -1) {
                  surveys[surveyIndex].questions[questionIndex].responses[
                    responsesIndex
                  ].count += 1;
                } else {
                  surveys[surveyIndex].questions[questionIndex].responses.push({
                    date: Date.now(),
                    value: ee.value,
                    count: 1,
                  });
                }
              }
            }
          }
        }
      }
    }
    console.log(surveys);
    refreshResponseList();
  };

  // funcion para recargar lista de encuestas agregadas
  function refreshSurveyList() {
    const surveysSelect = document.getElementsByClassName("surveySelector");
    let concatOptions = "";
    for (let i = 0; i < surveys.length; i++) {
      const e = surveys[i];
      concatOptions += `<option value="${e.id}" ${i == 0 ? "selected" : ""}>${
        e.name
      }</option>`;
    }
    if (surveysSelect) {
      for (let i = 0; i < surveysSelect.length; i++) {
        const e = surveysSelect[i];
        e.innerHTML = concatOptions;
      }
    }
  }

  // cada que se ejecute un evento de escucha y coloquemos esta funcion, las respuestas serán actualizadas
  function refreshResponseList() {
    const responseFieldset = document.getElementById("responseSurveyFieldset");
    let htmlSurvey = "";
    for (let i = 0; i < surveys.length; i++) {
      const e = surveys[i];
      htmlSurvey += `<fieldset><legend>${e.name}</legend>`;
      for (let ii = 0; ii < e.questions.length; ii++) {
        const ee = e.questions[ii];
        htmlSurvey += `<fieldset><legend>${ee.name}</legend><div>`;
        for (let iii = 0; iii < ee.responses.length; iii++) {
          const eee = ee.responses[iii];
          htmlSurvey += `<label>- ${eee.value}: ${eee.count}</label><br>`;
        }
        htmlSurvey += `</div></fieldset>`;
      }
      htmlSurvey += `</fieldset><br>`;
    }
    responseFieldset.innerHTML = htmlSurvey;
  }
};
