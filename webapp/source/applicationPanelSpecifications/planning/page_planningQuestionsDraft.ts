import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_planningQuestionsDraft",
    displayName: "Answer PNI planning questions",
    pageExplanation: "Describe your project's goals, relationships, focus, range, scope, and emphasis.",
    pageCategories: "plan",
    panelFields: [
        {
            id: "project_draftQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `You can use this page to answer some <strong>planning questions</strong> about your project: 
                its goals, relationships, focus, range, scope, and emphasis. 
                If you don't have good answers for these questions right now, don't worry; these are only <strong>draft answers</strong>.
                You will have a chance to revise them later.`
        },
        {
            id: "project_pniQuestions_goal_draft",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project goal",
            displayPrompt: "What is the <strong>goal</strong> of the project? Why are you doing it? What will be achieved if it succeeds?"
        },
        {
            id: "project_pniQuestions_relationships_draft",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project relationships",
            displayPrompt: "What <strong>relationships</strong> are important to the project? Who will connect with whom, how, and why? Who will tell stories, listen to stories, make sense of stories, facilitate, and so on?"
        },
        {
            id: "project_pniQuestions_focus_draft",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project focus",
            displayPrompt: "What is the <strong>focus</strong> of the project? What is it about? What is its subject matter?"
        },
        {
            id: "project_pniQuestions_range_draft",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project range",
            displayPrompt: "What <strong>range</strong> (or ranges) of experience will the project cover? Which perspectives will be explored? (Perhaps multiple groups, or locations, or time frames.)"
        },
        {
            id: "project_pniQuestions_scope_draft",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project scope",
            displayPrompt: "What is the project's <strong>scope</strong>? How many people will be involved? How many stories? How many questions? How many sessions?"
        },
        {
            id: "project_pniQuestions_emphasis_draft",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project emphasis",
            displayPrompt: "What is the project's <strong>emphasis</strong>? Which phases of PNI (planning, collection, catalysis, sensemaking, intervention, return) will be important to the project?"
        },
        {
            id: "project_pniQuestions_reminders_from_previous_project",
            valueType: "string",
            displayType: "textarea",
            displayName: "Reminders from previous project",
            displayPrompt: "If you copied any <strong>reminders</strong> from your reflections on a previous project (on the \"Reflect on the project\" page), you can paste them here."
        }
    ]
};

export = panel;

