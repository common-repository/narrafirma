import dialogSupport = require("../panelBuilder/dialogSupport");
import RecommendationsParser = require("../RecommendationsParser");
import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import Project = require("../Project");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

function add_recommendationTable(panelBuilder: PanelBuilder, model, fieldSpecification) {
    const dialogConfiguration = {
        fieldSpecification: fieldSpecification,
        dialogModel: model,
        dialogTitle: "#title_recommendationsTable|Recommendations table",
        dialogClass: "wide",
        dialogConstructionFunction: build_recommendationTable.bind(null, panelBuilder),
        dialogOKButtonLabel: "Close"
    };
    return dialogSupport.addButtonThatLaunchesDialog(fieldSpecification, dialogConfiguration);
}

    
function tagForRecommendationValue(recommendation) {
    if (recommendation === "no") {
        return "recommendationNo";
    } else if (recommendation === "maybe") {
        return "recommendationLow";
    } else if (recommendation === "good") {
        return "recommendationMedium";
    } else if (recommendation === "excellent") {
        return "recommendationHigh";
    }
    console.log("ERROR: Unexpected recommendation value", recommendation);
    return "";
}

function makeTableForParticipantGroup(categoryName: string, project: Project, participantGroupIdentifier: string) {
    let recommendationsObject: RecommendationsParser; 
    if (categoryName === "interventions") {
         recommendationsObject = RecommendationsParser.recommendationsIntervention();
    } else {
        recommendationsObject = RecommendationsParser.recommendations();
    }
    // recommendations -> Question -> Answer -> Category -> Option
    
    let optionsForCategory = recommendationsObject.categories[categoryName];
    if (!optionsForCategory) {
        console.log("ERROR: No data for recommendationTable category: ", categoryName);
        optionsForCategory = [];
    }
    
    const table = m("table.recommendationsTable", 
        // Do the header
        m("tr", [[
            m("th.wwsRecommendationsTable-valueCell", {colspan: 4, align: "right"}, m("i", "Question")),
            m("th.wwsRecommendationsTable-valueCell", {colspan: 2, align: "right"}, m("i", "Your answer"))
        ], optionsForCategory.map(function(headerFieldName) {
            return m("th.wwsRecommendationsTable-valueCell", m("i", {colspan: 1, align: "right"}, headerFieldName));
        })]),
    
        // Now do one data row for each question considered in the recommendation
        // TODO: Maybe keys should be sorted somehow?
        Object.keys(recommendationsObject.questions).map(function(questionName) {
            // TODO: Possible should improve this translation default, maybe by retrieving fieldSpecification for question and getting displayPrompt?
            const questionText = translate(questionName + "::shortName", questionName);
            let yourAnswer = project.tripleStore.queryLatestC(participantGroupIdentifier, questionName);
            if (yourAnswer === undefined) yourAnswer = project.getFieldValue(questionName);
            if (yourAnswer === undefined) yourAnswer = "";
            // Don't put rows where there is no answer
            if (!yourAnswer) return [];
            
            // Drill down into the recommentations if they exist for questioName, yourAnswer, and categoryName
            let recommendationsForAnswer = recommendationsObject.recommendations[questionName];
            if (recommendationsForAnswer) recommendationsForAnswer = recommendationsForAnswer[yourAnswer];
            if (recommendationsForAnswer) recommendationsForAnswer = recommendationsForAnswer[categoryName];
            
            return m("tr", [[
                m("th.wwsRecommendationsTable-valueCell", {colspan: 4, align: "right"}, questionText),
                m("th.wwsRecommendationsTable-valueCell", {colspan: 2, align: "right"}, yourAnswer)
            ], optionsForCategory.map(function(optionName, index) {
                let recommendationForOption = "???";
                if (recommendationsForAnswer) {
                    recommendationForOption = recommendationsForAnswer[optionName];
                } else {
                    console.log("Missing recommendations for", questionName, yourAnswer);
                }
                if (!recommendationForOption) {
                    if (categoryName === "interventions") {
                        recommendationForOption = "maybe";
                    } else {
                        recommendationForOption = "good";
                    }
                }
                if (recommendationForOption === "very good") recommendationForOption = "excellent";
                // TODO: Translate recommendation name 
                const theClass = tagForRecommendationValue(recommendationForOption);
                return m("td.wwsRecommendationsTable-labelCell", {colspan: 1, align: "right", "class": theClass}, recommendationForOption);
            })]);
        })
    );
    
    return table;
}

function build_recommendationTable(panelBuilder: PanelBuilder, dialogConfiguration, hideDialogCallback) {
    const model = dialogConfiguration.dialogModel;
    const fieldSpecification = dialogConfiguration.fieldSpecification;
    const prompt = panelBuilder.buildQuestionLabel(fieldSpecification);
    const categoryName = fieldSpecification.displayConfiguration;
    
    let participantGroups;
    let participantGroupNameFieldIdentifier;
    if (categoryName === "interventions") {
        participantGroups = Globals.project().getListForField("project_outcomesList");
        participantGroupNameFieldIdentifier = "outcomes_group";
        // TODO: Translate
        if (!participantGroups || !participantGroups.length) return m("div", "Please enter at least one project outcome so we can choose which recommendations to show you.");
    } else {
        participantGroups = Globals.project().getListForField("project_participantGroupsList");
        participantGroupNameFieldIdentifier = "participantGroup_name";
        // TODO: Translate
        if (!participantGroups || !participantGroups.length) return m("div", "Please enter at least one participant group so we can choose which recommendations to show you.");
    }
    
    // TODO: Set class on div
    return m("div", {"class": "narrafirma-recommendations-table " + categoryName}, [
        prompt,
        participantGroups.map(function (participantGroupIdentifier) {
            const participantGroupName = Globals.project().tripleStore.queryLatestC(participantGroupIdentifier, participantGroupNameFieldIdentifier);
            return m("div", [
                m("b", participantGroupName),
                m("br"),
                m("br"),
                makeTableForParticipantGroup(categoryName, Globals.project(), participantGroupIdentifier),
                m("br"),
                m("br")
            ]);
        })
    ]);
}

export = add_recommendationTable;
