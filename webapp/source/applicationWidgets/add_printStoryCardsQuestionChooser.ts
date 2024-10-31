import PanelBuilder = require("../panelBuilder/PanelBuilder");
import m = require("mithril");
import valuePathResolver = require("../panelBuilder/valuePathResolver");
import Globals = require("../Globals");
import questionnaireGeneration = require("../questionnaireGeneration");

"use strict";

// TODO: This code is redundant with code from add_catalysisReportQuestionChooser - needs to be merged

function add_printStoryCardsQuestionChooser(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const project = Globals.project();

    const storyCollectionName = Globals.clientState().storyCollectionName();
    if (!storyCollectionName) return m("div", "Please select a story collection.");

    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    const storageFunction = valuePathResolver.newValuePathForFieldSpecification(model, fieldSpecification);

    const allStoryQuestions = project.storyQuestionsForStoryCollection(storyCollectionName);
    const elicitingQuestions = [project.elicitingQuestionForStoryCollection(storyCollectionName)];
    const allParticipantQuestions = project.participantQuestionsForStoryCollection(storyCollectionName);
    const allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(project.collectAllAnnotationQuestions(), "A_");
    
    function isChecked(shortName, value = undefined) {
        const map = storageFunction() || {};
        if (value === undefined) {
            return !!map[shortName];
        }
        map[shortName] = !!value;
        storageFunction(map);
    }
    
    function buildQuestionCheckbox(shortName, questionType, questionCategory): any {
        const id = questionCategory + shortName;
        if (questionType === "label" || (questionType === "header")) return [];
        
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, shortName),
            m("br")
            ]);
    }
    
    function buildQuestionCheckboxSpecialForElicitingQuestion(): any {
        const id = "elicitingQuestion";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Eliciting question"),
            m("br")
        ]);
    }
    
    function buildQuestionCheckboxSpecialForNumStoriesTold(): any {
        const id = "numStoriesTold";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Number of stories told"),
            m("br")
        ]);
    }

    function buildQuestionCheckboxSpecialForStoryLength(): any {
        const id = "storyLength";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Story length"),
            m("br")
        ]);
    }

    function buildQuestionCheckboxSpecialForStoryCollectionDate(): any {
        const id = "collectionDate";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Collection date"),
            m("br")
        ]);
    }

    function buildQuestionCheckboxSpecialForLanguage(): any {
        const id = "language";
        return m("div", [
            m("input[type=checkbox]", {id: id, checked: isChecked(id), onchange: function(event) { isChecked(id, event.target.checked); }}),
            m("label", {"for": id}, "Language"),
            m("br")
        ]);
    }
    
    function selectElements(displayTypes: any = null) {
        const map = {};
        if (elicitingQuestions) {
            elicitingQuestions.forEach((question) => {
                if (!displayTypes) map["elicitingQuestion"] = true;
            });
        }
        allStoryQuestions.forEach((question) => {
            if (!displayTypes || displayTypes.indexOf(question.displayType) >= 0) map["S_" + question.displayName] = true;
        });
        allParticipantQuestions.forEach((question) => {
            if (!displayTypes || displayTypes.indexOf(question.displayType) >= 0) map["P_" + question.displayName] = true;
        });
        allAnnotationQuestions.forEach((question) => {
            if (!displayTypes || displayTypes.indexOf(question.displayType) >= 0) map["A_" + question.displayName] = true;
        });
        if (!displayTypes) map["numStoriesTold"] = true;
        if (!displayTypes) map["storyLength"] = true;
        if (!displayTypes) map["collectionDate"] = true;
        if (!displayTypes) map["language"] = true;
        storageFunction(map);
    }

    function selectAll() {
        selectElements();
    }

    function selectAllScaleQuestions() {
        selectElements(["slider"]);
    }

    function selectAllChoiceQuestions() {
        selectElements(["select", "radiobuttons", "checkboxes"]);
    }
    
    function selectAllTextQuestions() {
        selectElements(["text", "textarea"]);
    }

    function selectAllAdditionalQuestions() {
        const map = {};
        map["elicitingQuestion"] = true;
        map["numStoriesTold"] = true;
        map["storyLength"] = true;
        map["collectionDate"] = true;
        map["language"] = true;
        storageFunction(map); 
    }

    function selectAllStoryQuestions() {
        const map = {};
        allStoryQuestions.forEach((question) => {
            map["S_" + question.displayName] = true;
        });
        storageFunction(map);
    }
    
    function selectAllParticipantQuestions() {
        const map = {};
        allParticipantQuestions.forEach((question) => {
            map["P_" + question.displayName] = true;
        });
        storageFunction(map);
    }

    function selectAllAnnotationQuestions() {
        const map = {};
        allAnnotationQuestions.forEach((question) => {
            map["A_" + question.displayName] = true;
        });
        storageFunction(map);
    }

    function clearAll() {
        storageFunction({});
    }
    
    // TODO: Translate

    // show questions by type
    const nominalQuestionTypes = ["select", "boolean", "checkbox", "checkboxes", "radiobuttons"];

    const storyRatioQuestions = [];
    const storyTextQuestions = [];
    const storyNominalQuestions = [];
    allStoryQuestions.forEach((question) => {
        if (question.displayType === "slider") {
            storyRatioQuestions.push(question);
        } else if (question.displayType === "text" || question.displayType === "textarea") {
            storyTextQuestions.push(question);
        } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            storyNominalQuestions.push(question);
        }
    });

    const participantRatioQuestions = [];
    const participantTextQuestions = [];
    const participantNominalQuestions = [];
    allParticipantQuestions.forEach((question) => {
        if (question.displayType === "slider") {
            participantRatioQuestions.push(question);
        } else if (question.displayType === "text" || question.displayType === "textarea") {
            participantTextQuestions.push(question);
        } else if (nominalQuestionTypes.indexOf(question.displayType) !== -1)  {
            participantNominalQuestions.push(question);
        }
    });

    let firstColumn = [];
    firstColumn.push(m("b", "Story questions"));
    firstColumn.push(m("br"));
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Scales"));
    firstColumn.push(m("fieldset", storyRatioQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");})));
    firstColumn.push(storyRatioQuestions.length ? [] : [m("i", " - none"), m("br")]);
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Choices"));
    firstColumn.push(m("fieldset", storyNominalQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");})));
    firstColumn.push(storyNominalQuestions.length ? [] : [m("i", " - none"), m("br")]);
    firstColumn.push(m("br"));
    firstColumn.push(m("i", "Texts"));
    firstColumn.push(m("fieldset", storyTextQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "S_");})));
    firstColumn.push(storyTextQuestions.length ? [] : [m("i", " - none"), m("br")]);
    let firstColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, firstColumn);

    let secondColumn = [];
    secondColumn.push(m("b", "Participant questions"));
    secondColumn.push(m("br"));
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Scales"));
    secondColumn.push(m("fieldset", participantRatioQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");})));
    secondColumn.push(participantRatioQuestions.length ? [] : [m("i", " - none"), m("br")]);
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Choices"));
    secondColumn.push(m("fieldset", participantNominalQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");})));
    secondColumn.push(participantNominalQuestions.length ? [] : [m("i", " - none"), m("br")]);
    secondColumn.push(m("br"));
    secondColumn.push(m("i", "Texts"));
    secondColumn.push(m("fieldset", participantTextQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "P_");})));
    secondColumn.push(participantTextQuestions.length ? [] : [m("i", " - none"), m("br")]);
    let secondColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, secondColumn);

    let thirdColumn = [];
    thirdColumn.push(m("b", "Annotation questions")); 
    thirdColumn.push(m("br"));
    thirdColumn.push(m("br"));
    thirdColumn.push(m("fieldset", allAnnotationQuestions.map((question) => {return buildQuestionCheckbox(question.displayName, question.displayType, "A_");})));
    thirdColumn.push(allAnnotationQuestions.length ? [] : [m("i", " - none"), m("br")]);
    thirdColumn.push(m("br"));
    thirdColumn.push(m("b", "Additional information"));
    thirdColumn.push(m("br"));
    thirdColumn.push(m("br"));
    if (elicitingQuestions) thirdColumn.push(m("fieldset", elicitingQuestions.map((question) => {return buildQuestionCheckboxSpecialForElicitingQuestion();})));
    thirdColumn.push(m("fieldset", [
        buildQuestionCheckboxSpecialForNumStoriesTold(), 
        buildQuestionCheckboxSpecialForStoryLength(), 
        buildQuestionCheckboxSpecialForStoryCollectionDate(), 
        buildQuestionCheckboxSpecialForLanguage()
    ]));
    let thirdColumnTD = m("td", {"class": "narrafirma-questions-chooser-table-td"}, thirdColumn);

    let table = m("table", {"class": "narrafirma-questions-chooser-table"}, m("tr", [firstColumnTD, secondColumnTD, thirdColumnTD]));

    return m("div.questionExternal", 
        [prompt, 
        m("div", table),
        m("span[style=margin-left: 0.5em]", "Select questions:"),
        m("button", { onclick: selectAll }, "All"),
        m("button", { onclick: selectAllStoryQuestions }, "Story"),
        m("button", { onclick: selectAllParticipantQuestions }, "Participant"),
        m("button", { onclick: selectAllAnnotationQuestions }, "Annotation"),
        m("button", { onclick: selectAllScaleQuestions }, "Scale"),
        m("button", { onclick: selectAllChoiceQuestions }, "Choice"),
        m("button", { onclick: selectAllTextQuestions }, "Text"),
        m("button", { onclick: selectAllAdditionalQuestions }, "Additional"),
        m("button", { onclick: clearAll }, "None"),
        m("br"),
        ]);

}

export = add_printStoryCardsQuestionChooser;
