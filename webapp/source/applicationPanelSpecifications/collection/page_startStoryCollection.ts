import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_startStoryCollection",
    displayName: "Start story collection",
    pageExplanation: "Create a container that will hold a group of stories. Activate or deactivate a web survey.",
    pageCategories: "manage",
    headerAbove: "Collect",
    panelFields: [
        {
            id: "storyCollection_createCollectionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can create one or more <strong>story collections</strong> for your project. A story collection is a body of stories collected using a specific story form." 
        },
        {
            id: "project_storyCollections",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addStoryCollection",
                gridConfiguration: {
                    removeButton: true,
                    customButton: {
                        customButtonLabel: "Activate or Deactivate Web Form", 
                        customButtonIconClass: "buttonWithTextImage activateOrDeactivateButtonImage",
                        callback: "toggleWebActivationOfSurvey"},
                    columnsToDisplay: ["storyCollection_shortName", "storyCollection_questionnaireIdentifier", "storyCollection_activeOnWeb", "storyCollection_notes"],
                    transformDisplayedValues: function (value, fieldName) {
                        if (fieldName !== "storyCollection_activeOnWeb") return value;
                        return value ? "yes" : "no";
                    }
                }
            },
            displayName: "Story collections",
            displayPrompt: "These are the story collections you have created."
        },
        {
            id: "createNewStoryCollection",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "createNewStoryCollection",
            displayIconClass: "addButtonImage",
            displayPrompt: "Create New Story Collection",
        },

    ]
};

export = panel;

