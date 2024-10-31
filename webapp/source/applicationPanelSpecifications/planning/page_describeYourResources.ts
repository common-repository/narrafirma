import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_describeYourResources",
    pageExplanation: "Answer questions about your resources. Your answers will drive recommendations that appear on other pages.",
    pageCategories: "plan",
    displayName: "Describe your resources",
    
    panelFields: [
         {
            id: "project_aboutYou",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page are a few questions about the <strong>resources</strong> available to you in carrying out your PNI project."
        },
        {
            id: "aboutYou_experience",
            valueType: "string",
            valueOptions: [
                "none",
                "a little",
                "some",
                "a lot"
            ],
            displayType: "select",
            displayName: "Experience",
            displayPrompt: "How much <strong>experience</strong> do you have facilitating PNI projects?"
        },
        {
            id: "aboutYou_help",
            valueType: "string",
            valueOptions: [
                "none",
                "a little",
                "some",
                "a lot"
            ],
            displayType: "select",
            displayName: "Help",
            displayPrompt: "How much <strong>help</strong> will you have carrying out this project?"
        },
        {
            id: "aboutYou_tech",
            valueType: "string",
            valueOptions: [
                "none",
                "a little",
                "some",
                "a lot"
            ],
            displayType: "select",
            displayName: "Technology",
            displayPrompt: "How many <strong>technological resources</strong> will you be able to use in carrying out this project?"
        }
    ]
};

export = panel;

