import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_designStoryForms",
    displayName: "Build story forms",
    pageExplanation: "Draw from your question libraries to create surveys and interview scripts.",
    pageCategories: "enter",
    panelFields: [
        {
            id: "storyForms_Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can design one or more <strong>story forms</strong> for your project. 
                Choose from the library of questions you already created to create the form your participants 
                will use to tell their stories and answer questions about them.
                You can also generate a story form using all existing questions or import one from a CSV file.`
        },
        {
            id: "project_storyForms",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addStoryForm",
                gridConfiguration: {
                    validateAdd: "requireShortName",
                    validateEdit: "requireShortName",
                    addButton: true,
                    removeButton: true,
                    duplicateButton: true,
                    navigationButtons: true,
                    columnsToDisplay: ["questionForm_shortName", "questionForm_title", "questionForm_startText"]
                }
            },
            displayName: "Story forms",
            displayPrompt: "These are the story forms you have added. Click on a story form to edit it."
        },


        {
            id: "storyForms_generate_Header",
            valueType: "none",
            displayType: "header",
            displayPrompt: `Generate a story form`
        },
        {
            id: "storyForms_generate_label",
            valueType: "none",
            displayType: "label",
            displayClass: "narrafirma-question-type-label-not-white",
            displayPrompt: `You can start a story form by filling it with <strong>all of the questions you have created</strong>. 
                This will place it into the list above. Afterwards, you can fine-tune its appearance. `
        },
        {
            id: "project_createStoryFormFromCreatedQuestions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "autoFillStoryForm",
            displayPreventBreak: true,
            displayIconClass: "generateButtonImage",
            displayPrompt: "Generate story form using all existing questions..."
        },
        {
            id: "storyForms_import_Header",
            valueType: "none",
            displayType: "header",
            displayPrompt: `Import a story form`
        },
        {
            id: "storyForms_import_label",
            valueType: "none",
            displayType: "label",
            displayClass: "narrafirma-question-type-label-not-white",
            displayPrompt: `You can <strong>import a story form</strong> you created in another project or in a spreadsheet. (For details on the import format, see the help system.) `
        },
        {
            id: "project_csvQuestionOverwriteOption",
            valuePath: "project_csvQuestionOverwriteOption",
            valueType: "string",
            valueOptions: [
                "always replace existing questions with matching questions from the CSV file", 
                "always keep existing questions; ignore any matching questions in the CSV file", 
                "show me the list of existing questions and ask if I still want to import the file",
                "ask me whether to replace each existing question", 
                "stop the import if any existing questions are found"],
            displayType: "select",
            displayName: "Question overwrite policy",
            displayPrompt: `During the import process, what do you want to do <strong>when a question already exists</strong> in the project? 
                (Questions match if their short names match. This only applies to story and participant questions. Eliciting questions are always overwritten.)`,

        },
        {
            id: "storyForms_import_delimiter_label",
            valueType: "none",
            displayType: "label",
            displayClass: "narrafirma-question-type-label-not-white",
            displayPrompt: `Also note: You can change your CSV delimiter in the "Project options" page under "Project administration.`
        },
        {
            id: "project_importStoryFormAndDataFromCSV",
            valueType: "none",
            displayType: "button",
            displayPreventBreak: true,
            displayIconClass: "importButtonImage",
            displayConfiguration: "importCSVQuestionnaire",
            displayPrompt: "Import CSV story form file..."
        },
        {
            id: "storyForms_import_showImportGuide",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showImportGuide",
            displayName: "Show import help",
            displayPreventBreak: true,
            displayIconClass: "showButtonImage",
            displayPrompt: "Show import help"
        },
        {
            id: "project_csvFileUploaderForForm",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="csvFileLoader" name="files" title="Import Story Form from CSV File" style="display:none"/>'
        },
    ]
};

export = panel;

