import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "panel_addStoryCollectionSession",
    modelClass: "StoryCollectionSessionPlan",
    panelFields: [
        {
            id: "collectionSessionPlan_name",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Collection session plan name",
            displayPrompt: "Please give this session plan a <strong>name</strong>."
        },
        {
            id: "collectionSessionPlan_groups",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Participant groups",
            displayPrompt: "From which participant <strong>group</strong> (or groups) will people be invited?"
        },
        {
            id: "collectionSessionPlan_repetitions",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Repetitions",
            displayPrompt: "How many <strong>repetitions</strong> of the session will there be?"
        },
        {
            id: "collectionSessionPlan_duration",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Length",
            displayPrompt: "<strong>How long</strong> will each session be?"
        },
        {
            id: "collectionSessionPlan_times",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Time",
            displayPrompt: "<strong>When</strong> will these sessions take place?"
        },
        {
            id: "collectionSessionPlan_location",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Location",
            displayPrompt: "<strong>Where</strong> will these sessions take place?"
        },
        {
            id: "collectionSessionPlan_numPeople",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            displayName: "Number of people",
            displayPrompt: "<strong>How many people</strong> will be invited to each repetition of this session?"
        },
        {
            id: "collectionSessionPlan_participantGroupsMixing",
            valueType: "string",
            displayType: "textarea",
            displayName: "Mixing",
            displayPrompt: "What are your plans for keeping participant groups <strong>together or apart</strong>?"
        },
        {
            id: "collectionSessionPlan_materials",
            valueType: "string",
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What <strong>materials</strong> will this session require?"
        },
        {
            id: "collectionSessionPlan_opportunitiesAndDangers",
            valueType: "string",
            displayType: "textarea",
            displayName: "Opportunities and dangers",
            displayPrompt: "What are some of the <strong>opportunities</strong> and <strong>dangers</strong> you foresee for this session plan?"
        },
        {
            id: "collectionSessionPlan_details",
            valueType: "string",
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Here you can enter other <strong>details</strong> about this session."
        },
        {
            id: "collectionSessionPlan_activitiesList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addCollectionSessionActivity",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true, 
                    duplicateButton: true,
               }
            },
            displayName: "Story collection activities",
            displayPrompt: "Here you can enter some <strong>activities</strong> you plan for the session. Activities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines)."
        },
        {
            id: "collectionSessionPlan_exportCollectionSessionAgendaButton",
            valueType: "none",
            displayType: "button",
            displayIconClass: "printButtonImage",
            displayPrompt: "Print session agenda",
            displayConfiguration: "exportCollectionSessionAgenda",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        }
    ]
};

export = panel;

