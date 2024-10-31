import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

// TODO: Maybe store one set of diagrams for each type of question?
// TODO: Maybe remove storiesList use and also supporting code?

const panel: Panel = {
    id: "page_createProjectStoryElements",
    displayName: "Create project story elements",
    pageExplanation: "Go through a small sensemaking exercise that will help you plan your project.",
    pageCategories: "plan",
    panelFields: [
        {
            id: "project_storyElements_instructions",
            valueType: "none",
            displayType: "label",
            displayPrompt: `You can use this page to create <b>story elements</b> based on your project stories. 
                Story elements are abstract representations of the meanings found in stories. 
                Going through this exercise can help you think about what you want to happen in your project. 
                (You can also do this exercise on paper. If you do that, skip to the bottom of this page to enter the story elements you created.)`
        },
        {
            id: "project_storyElements__questionType",
            valueType: "string",
            valueOptions: [
                {value: "characters", label: "Characters: Who is doing things in this story?"},
                {value: "situations", label: "Situations: What is going on in this story?"},
                {value: "values", label: "Values: What matters to the characters in this story?"},
                {value: "themes", label: "Themes: What is this story about?"},
                {value: "relationships", label: "Relationships: How are the characters related in this story?"},
                {value: "motivations", label: "Motivations: Why do the characters do what they do in this story?"},
                {value: "beliefs", label: "Beliefs: What do people believe in this story?"},
                {value: "conflicts", label: "Conflicts: Who or what stands in opposition in this story?"}
            ],
            displayDataOptionField: "label",
            displayType: "select",
            displayPrompt: "<b>1</b>. Choose a <b>type</b> of story element to create."
        },
        {
            id: "project_storyElements_storiesList",
            valueType: "object",
            valuePath: "project_projectStoriesList",
            displayType: "storiesList",
            displayPrompt: `
                <b>2</b>. These are your project stories.
                Click on the button below to copy them as clusters to the first diagram.
            `
        },
        {
            id: "project_storyElements_copyButton1",
            valueType: "none",
            displayType: "button",
            displayIconClass: "copyButtonImage",
            displayPrompt: "Copy planning stories to clustering diagram",
            displayConfiguration: "copyPlanningStoriesToClusteringDiagram"
        },
        {
            id: "project_storyElements_answersClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>3</b>. For each story, come up with as many <b>answers</b> to the above question as you can.
                For each answer, choose <b>Create new answer</b> from the list below, then click <b>Do it</b>.
            `
        },
        {
            id: "project_storyElements_copyButton2Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                <b>4</b>. When you have considered all of your project stories,
                press the button below to copy your answers to the next clustering diagram. 
            `
        },        
        {
            id: "project_storyElements_copyButton2",
            valueType: "none",
            displayType: "button",
            displayIconClass: "copyButtonImage",
            displayPrompt: "Copy new answers to next clustering diagram",
            displayConfiguration: "copyAnswersToClusteringDiagram"
        },
        {
            id: "project_storyElements_answerClustersClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>5</b>. Now <b>cluster</b> your answers together. 
                Drag the circles to place like with like.<br> 
                <b>6</b>. Give each cluster of answers a <b>name</b> (choose <b>Create new cluster name</b>, then click <b>Do it</b>).
            `
        },
        {
            id: "project_storyElements_copyButton3Label",
           valueType: "none",
            displayType: "label",
            displayPrompt: `
                <b>7</b>. Press the button below to copy your cluster names to the next diagram. 
            `
        },        
        {
            id: "project_storyElements_copyButton3",
            valueType: "none",
            displayType: "button",
            displayIconClass: "copyButtonImage",
            displayPrompt: "Copy new answers to next clustering diagram",
            displayConfiguration: "copyAnswerClustersToClusteringDiagram"
        },
        {
            id: "project_storyElements_attributesClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>8</b>. Describe each cluster by adding <b>attributes</b> to it.
                Ask yourself: What is good and bad about this cluster? What helps you, and what works against you? 
                Where is the opportunity, and where is the challenge? Create at least two positive and two negative 
                attributes for each cluster. For each attribute, choose <b>Create new answer</b>, then click <b>Do it</b>.
                (If you can't think of both positive and negative attributes, keep trying. 
                The exercise depends on the attributes being balanced.)
            `
        },
        {
            id: "project_storyElements_copyButton4Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                <b>9</b>. Press the button below to copy your attributes to the next diagram. 
            `
        },        
        {
            id: "project_storyElements_copyButton4",
            valueType: "none",
            displayType: "button",
            displayIconClass: "copyButtonImage",
            displayPrompt: "Copy new attributes to next clustering diagram",
            displayConfiguration: "copyAttributesToClusteringDiagram"
        },
        {
            id: "project_storyElements_attributeClustersClusteringDiagram",
            valueType: "object",
            displayType: "clusteringDiagram",
            displayPrompt: `
                <b>10</b>. <b>Rearrange</b> the attributes into new, different clusters, placing like with like, as you did before.<br>
                <b>11</b>. <b>Create new clusters</b> with new names and descriptions. These are your story elements.
            `
        },
        {
            id: "project_storyElements_reflection_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: `Questions for reflection`
        },
        {
            id: "project_storyElements_reflection_do",
            valueType: "string",
            displayType: "textarea",
            displayName: "Things to do based on story elements exercise",
            displayPrompt: `What does this exercise tell you that you should <strong>remember to do</strong> in your project?`
        },
        {
            id: "project_storyElements_reflection_avoid",
            valueType: "string",
            displayType: "textarea",
            displayName: "Things to avoid based on story elements exercise",
            displayPrompt: `What does this exercise tell you that you should <strong>remember to avoid</strong> in your project?`
        },
        {
            id: "project_storyElements_reflection_otherNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Other notes on story elements exercise",
            displayPrompt: `Is there <strong>anything else</strong> you would like to remember about this exercise?`
        }
    ]
};

export = panel;

