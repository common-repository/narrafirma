import m = require("mithril");
import surveyCollection = require("surveyCollection");
import questionnaireGeneration = require("./questionnaireGeneration");
import Globals = require("./Globals");

"use strict";

const defaultBetweenAnswerText = " / ";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function replaceSpacesWithDashes(text) {
    if (text) {
        return replaceAll(text.trim(), " ", "-");
    } else {
        return "";
    }
}

function wrap(elementType, cssClass, text) {
    return m(elementType, {"class": cssClass}, text);
}

function displayHTMLForSlider(fieldSpecification, fieldName, value, options) {
    let lowLabel = "";
    let highLabel = "";
    if (fieldSpecification.displayConfiguration !== undefined && fieldSpecification.displayConfiguration.length > 1) {
        lowLabel = fieldSpecification.displayConfiguration[0];
        highLabel = fieldSpecification.displayConfiguration[1];
    }
    const sliderText = [];
    let sliderTextBefore = "";
    let sliderTextAfter = "";
    // Assumes values go from 0 to 100; places 100.0 in last bucket
    const bucketCount = options.sliderBucketCount || 50;
    const bucketSize = 100.0 / bucketCount;
    let placed = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    if (value !== undefined && value !== "") {
        for (let i = 0; i < bucketCount; i++) {
            const bucketHigh = i * bucketSize + bucketSize;
            if (!placed) {
                if (value && ((value < bucketHigh) || (value && i === bucketCount - 1))) {
                    sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-before " + answerClass + '-slider-bars-before'}, sliderTextBefore));
                    sliderText.push(m("span", {"class": "narrafirma-story-card-slider-button " + answerClass + "-slider-button"}, options.sliderButtonCharacter || "|"));
                    placed = true;
                } else {
                    sliderTextBefore += options.beforeSliderCharacter || "-";
                }
            } else {
                sliderTextAfter += options.afterSliderCharacter || "-";
            }
        }
        sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-after " + answerClass + "-slider-bars-after"}, sliderTextAfter));
    } else {
        // no answer
        sliderTextAfter = new Array(bucketCount + 1).join(options.noAnswerSliderCharacter || "-");
        sliderText.push(m("span", {"class": "narrafirma-story-card-slider-bars-no-answer " + answerClass + "-slider-bars-no-answer"}, sliderTextAfter));
    }
    return m("tr", [
        wrap("td", "narrafirma-story-card-slider-name", m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName)),
        wrap("td", "narrafirma-story-card-slider-label-left", lowLabel),
        wrap("td", "narrafirma-story-card-slider-contents", sliderText),
        wrap("td", "narrafirma-story-card-slider-label-right", highLabel)
     ]); 
}

function displayHTMLForCheckboxes(fieldSpecification, fieldName, value, hideNonSelectedAnswers, betweenAnswerText) {
    const result = [];
    let atLeastOneAnswerWasChecked = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    result.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    const answersAlreadyConsidered = [];
    const answerElements = [];

    for (let i = 0; i < fieldSpecification.valueOptions.length; i++) {
        const answerBeingConsidered = fieldSpecification.valueOptions[i];
        if (answersAlreadyConsidered.indexOf(answerBeingConsidered) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        answersAlreadyConsidered.push(answerBeingConsidered);

        if (value && value[answerBeingConsidered]) {
            if (!hideNonSelectedAnswers) {
                answerElements.push(wrap("span", "narrafirma-story-card-checkboxes-selected " + answerClass + "-selected", answerBeingConsidered));
            } else {
                answerElements.push(wrap("span", "narrafirma-story-card-checkboxes-visible " + answerClass + "-visible", answerBeingConsidered));
            }
            atLeastOneAnswerWasChecked = true;
        } else if (!hideNonSelectedAnswers) {
            answerElements.push(wrap("span", "narrafirma-story-card-checkboxes-unselected " + answerClass + "-unselected", answerBeingConsidered));
        }
    }

    for (let i = 0; i < answerElements.length; i++) {
        result.push(answerElements[i]);
        if (i < answerElements.length - 1) result.push(m("span", betweenAnswerText));
    }
    return [result, atLeastOneAnswerWasChecked];
}

function displayHTMLForRadioButtons(fieldSpecification, fieldName, value, hideNonSelectedAnswers, betweenAnswerText) {
    const result = [];
    let atLeastOneAnswerWasChecked = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    result.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    const answersAlreadyConsidered = [];
    const answerElements = [];

    for (let i = 0; i < fieldSpecification.valueOptions.length; i++) {
        const answerBeingConsidered = fieldSpecification.valueOptions[i];
        if (answersAlreadyConsidered.indexOf(answerBeingConsidered) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        answersAlreadyConsidered.push(answerBeingConsidered);
        if (value && value === answerBeingConsidered) {
            if (!hideNonSelectedAnswers) {
                answerElements.push(wrap("span", "narrafirma-story-card-radiobuttons-selected " + answerClass + "-selected", answerBeingConsidered));
            } else {
                answerElements.push(wrap("span", "narrafirma-story-card-radiobuttons-visible " + answerClass + "-visible", answerBeingConsidered));
            }
            atLeastOneAnswerWasChecked = true;
        } else if (!hideNonSelectedAnswers) {
            answerElements.push(wrap("span", "narrafirma-story-card-radiobuttons-unselected " + answerClass + "-unselected", answerBeingConsidered));
        }
    }
    for (let i = 0; i < answerElements.length; i++) {
        result.push(answerElements[i]);
        if (i < answerElements.length - 1) result.push(m("span", betweenAnswerText));
    }
    return [result, atLeastOneAnswerWasChecked];
}

function displayHTMLForSelect(fieldSpecification, fieldName, value, hideNonSelectedAnswers, betweenAnswerText) {
    const result = [];
    let atLeastOneAnswerWasChecked = false;
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldName);
    result.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldName)}, fieldName + ": "));
    // TODO: What if value is not currently available option?
    const answersAlreadyConsidered = [];
    const answerElements = [];

    for (let i = 0; i < fieldSpecification.valueOptions.length; i++) {
        const answerBeingConsidered = fieldSpecification.valueOptions[i];
        if (answersAlreadyConsidered.indexOf(answerBeingConsidered) >= 0) continue; // hide duplicate options, if any, due to lumping during import
        answersAlreadyConsidered.push(answerBeingConsidered);
        if (value && value === answerBeingConsidered) {
            if (!hideNonSelectedAnswers) {
                answerElements.push(wrap("span", "narrafirma-story-card-select-selected " + answerClass + "-selected", answerBeingConsidered));
            } else {
                answerElements.push(wrap("span", "narrafirma-story-card-select-visible " + answerClass + "-visible", answerBeingConsidered));
            }
            atLeastOneAnswerWasChecked = true;
        } else if (!hideNonSelectedAnswers) {
            answerElements.push(wrap("span", "narrafirma-story-card-select-unselected " + answerClass + "-unselected", answerBeingConsidered));
        }
    }
    for (let i = 0; i < answerElements.length; i++) {
        result.push(answerElements[i]);
        if (i < answerElements.length - 1) result.push(m("span", betweenAnswerText));
    }
    return [result, atLeastOneAnswerWasChecked];
}

function displayHTMLForField(storyModel: surveyCollection.Story, fieldSpecification, options, nobreak = null) {
    // if (!model[fieldSpecification.id]) return "";
    let value = storyModel.fieldValue(fieldSpecification.id);
    let displayValue = value;
    const isAnnotationQuestion = fieldSpecification.id.indexOf("A_") >= 0;

    if (options.lumpingCommands && options.lumpingCommands.hasOwnProperty(fieldSpecification.displayName)) {
        if (fieldSpecification.displayType === "checkboxes") { 

                const answersToReport = {}; 
                const valueKeys = Object.keys(value);
                for (let i = 0; i < valueKeys.length; i++) {
                    // see note in calculateStatistics about lumping commands and trimming
                    const trimmedKey = valueKeys[i].trim();
                    answersToReport[trimmedKey] = value[valueKeys[i]];
                }

            const answersToLumpTogether = Object.keys(options.lumpingCommands[fieldSpecification.displayName]);
            for (let i = 0; i < answersToLumpTogether.length; i++) {
                const thisAnswer = answersToLumpTogether[i];
                if (answersToReport.hasOwnProperty(thisAnswer)) {
                    const substituteAnswer = options.lumpingCommands[fieldSpecification.displayName][thisAnswer];
                    delete answersToReport[thisAnswer];
                    answersToReport[substituteAnswer] = true;
                }
            }
            displayValue = answersToReport;
        } else {
            // see note in calculateStatistics about lumping commands and trimming
            const trimmedValue = value.trim();
            if (options.lumpingCommands[fieldSpecification.displayName].hasOwnProperty(trimmedValue)) 
            displayValue = options.lumpingCommands[fieldSpecification.displayName][trimmedValue];
        }
    }

    const fieldNameToShow = fieldSpecification.displayName || fieldSpecification.displayPrompt;
    const displayType = fieldSpecification.displayType;
    const result = [];
    const answerClass = "narrafirma-story-card-answer-for-" + replaceSpacesWithDashes(fieldNameToShow);
    if (displayType === "slider") {
        result.push(displayHTMLForSlider(fieldSpecification, fieldNameToShow, displayValue, options));
    } else if (["checkboxes", "select", "radiobuttons"].indexOf(displayType) >= 0) {
        let answerHTMLDivsAndWhetherAtLeastOneIsSelected = [];
        if (displayType === "checkboxes") {
            answerHTMLDivsAndWhetherAtLeastOneIsSelected = displayHTMLForCheckboxes(fieldSpecification, fieldNameToShow, displayValue, 
                options.hideNonSelectedAnswers || false, options.betweenAnswerText || defaultBetweenAnswerText);
        } else if (displayType === "select") {
            answerHTMLDivsAndWhetherAtLeastOneIsSelected = displayHTMLForSelect(fieldSpecification, fieldNameToShow, displayValue, 
                options.hideNonSelectedAnswers || false, options.betweenAnswerText || defaultBetweenAnswerText);
        } else if (displayType === "radiobuttons") {
            answerHTMLDivsAndWhetherAtLeastOneIsSelected = displayHTMLForRadioButtons(fieldSpecification, fieldNameToShow, displayValue, 
                options.hideNonSelectedAnswers || false, options.betweenAnswerText || defaultBetweenAnswerText);
        }
        let answerHTMLDivs = [];
        let atLeastOneAnswerIsSelected = false;
        if (answerHTMLDivsAndWhetherAtLeastOneIsSelected.length > 0) {
            answerHTMLDivs = answerHTMLDivs.concat(answerHTMLDivsAndWhetherAtLeastOneIsSelected[0]);
            if (answerHTMLDivsAndWhetherAtLeastOneIsSelected.length > 0) {
                atLeastOneAnswerIsSelected = answerHTMLDivsAndWhetherAtLeastOneIsSelected[1];
            }
        }

        if (options.hideNonSelectedAnswers) {
            if (atLeastOneAnswerIsSelected) {
                result.push(wrap("div", "narrafirma-story-card-question-line-basic", answerHTMLDivs));
            } else {
                // hide question if there is no answer to it?
            }
        } else { // show non-selected answers
            if (atLeastOneAnswerIsSelected) {
                result.push(wrap("div", "narrafirma-story-card-question-line-with-selected-item", answerHTMLDivs));
            } else if (options.hideNon) {
                result.push(wrap("div", "narrafirma-story-card-question-line-without-selected-item", answerHTMLDivs));
            }
        }
    } else if (displayType === "boolean") {
        const thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldNameToShow)}, fieldNameToShow + ": "));
        if (displayValue === true) {
            thisBit.push(m("span", {"class": answerClass}, "yes"));
        } else if (displayValue === false) {
            thisBit.push(m("span", {"class": answerClass}, "no"));
        } else {
            thisBit.push(m("span", {"class": answerClass}, ""));
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-basic", thisBit));
    } else if (displayType === "checkbox") {
        const thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldNameToShow)}, fieldNameToShow + ": "));
        if (displayValue === true) {
            thisBit.push(m("span", {"class": answerClass}, "true"));
        } else if (displayValue === false) {
            thisBit.push(m("span", {"class": answerClass}, "false"));
        } else {
            thisBit.push(m("span", {"class": answerClass}, ""));
        }
        result.push(wrap("div", "narrafirma-story-card-question-line-basic", thisBit));
    } else if (displayType === "label" || fieldSpecification.displayType === "header") {
        return [];
    } else {
        // TODO: May need more handling here for other cases
        const thisBit = [];
        thisBit.push(m("span", {"class": "narrafirma-story-card-field-name-" + replaceSpacesWithDashes(fieldNameToShow)}, fieldNameToShow + ": "));
        thisBit.push(m("span", {"class": answerClass}, value));
        result.push(wrap("div", "narrafirma-story-card-question-line-basic", thisBit));
    }

    if (options.includeWriteInAnswers) {
        const writeInEntry = storyModel.fieldValueWriteIn(fieldSpecification.id);
        if (writeInEntry) {
            result.push(wrap("span", "narrafirma-story-card-write-in-answer", writeInEntry));
        }
    }

    if (isAnnotationQuestion) {
        return wrap("div", "narrafirma-story-card-annotation", result);
    } else {
        return result;  
    }
}

interface Options {
    storyTextAtTop?: boolean;
    questionnaire?: any;
    location?: string;
    beforeSliderCharacter?: string;
    sliderButtonCharacter?: string;
    afterSliderCharacter?: string;
    noAnswerSliderCharacter?: string;
    order?: string;
    cutoff?: string;
    cutoffMessage?: string;
    includeIndex?: string;
    includeWriteInAnswers?: boolean;
    lumpingCommands?: any;
    hrAtBottom?: boolean;
    blankLineAfterStory?: boolean;
}

export function generateStoryCardContent(storyModel, questionsToInclude, options: Options = {}) {
    const elicitingQuestion = storyModel.elicitingQuestion();
    const numStoriesTold = storyModel.numStoriesTold();
    const storyLength = storyModel.storyLength();
    
    let storyName = storyModel.storyName();

    const storyCollectionDate = storyModel.storyCollectionDate();
    const language = storyModel.storyLanguage();

    let storyText = storyModel.storyText();
    if (options.cutoff && options.cutoff !== "no limit") {
        const cutoffValue = parseInt(options.cutoff);
        const cutoffMessageToUse = options.cutoffMessage || "... (truncated)";
        if (!isNaN(cutoffValue)) {
            if (storyText.length > cutoffValue) {
                storyText = storyText.slice(0, cutoffValue) + cutoffMessageToUse;
            }
        }
    }

    let formattedFields = [];

    let questionnaire = storyModel.questionnaire();
    if (options.questionnaire) questionnaire = options.questionnaire;

    let allQuestions = [];
    if (questionnaire) {
        if (options["location"] || options["location"] !== "storyAnnotationBrowser") {
            allQuestions = allQuestions.concat(questionnaire.storyQuestions);
            allQuestions = allQuestions.concat(questionnaire.participantQuestions);
        }
        const allAnnotationQuestions = questionnaireGeneration.convertEditorQuestions(Globals.project().collectAllAnnotationQuestions(), "A_");
        if (allAnnotationQuestions) allQuestions = allQuestions.concat(allAnnotationQuestions);
    }

    let questions = [];
    if (questionsToInclude) {
        allQuestions.forEach((question) => {
            if (questionsToInclude[question.id]) {
                questions.push(question);
            }
        });
    } else {
        questions = allQuestions;
    }

    if (options.lumpingCommands) {
        questions.forEach((question) => {
            if (options.lumpingCommands.hasOwnProperty(question.displayName)) {
                const lumpedAnswersToAdd = [];
                question.valueOptions = question.valueOptions.filter((answer) => {
                    // see note in calculateStatistics about lumping commands and trimming
                    const trimmedAnswer = answer.trim();
                    const lumpedAnswer = options.lumpingCommands[question.displayName][trimmedAnswer];
                    if (lumpedAnswer) {
                        if (lumpedAnswersToAdd.indexOf(lumpedAnswer) < 0) lumpedAnswersToAdd.push(lumpedAnswer);
                        return false;
                    } 
                    return true;
                });
                lumpedAnswersToAdd.forEach((answer) => { if (question.valueOptions.indexOf(answer) < 0) question.valueOptions.push(answer); });
            }
        });
    }

    //valueOptions: [
    //    "order on story form, scales separate",
    //    "order on story form, scales mixed in",
    //    "alphabetical order, scales separate",
    //    "alphabetical order, scales mixed in"
    //],

    const sortAlphabetically = options.order != undefined && options.order.indexOf("alphabetical") >= 0;
    const sortScalesSeparately = options.order != undefined && options.order.indexOf("scales separate") >= 0;

    if (sortAlphabetically) {
        questions.sort(function(a, b) {
            let aName = a.displayName || a.displayPrompt || "";
            aName = aName.toLowerCase();
            let bName = b.displayName || b.displayPrompt || "";
            bName = bName.toLowerCase();
                
            const aIsAnnotationQuestion = a.id.indexOf("A_") >= 0;
            const bIsAnnotationQuestion = b.id.indexOf("A_") >= 0;

            if ((aIsAnnotationQuestion && bIsAnnotationQuestion) || (!aIsAnnotationQuestion && !bIsAnnotationQuestion)) {
                if (aName < bName) return -1;
                if (aName > bName) return 1;
            } else if (aIsAnnotationQuestion && !bIsAnnotationQuestion) {
                return 1;
            } else if (!aIsAnnotationQuestion && bIsAnnotationQuestion) {
                return -1;
            }
            return 0;
        });
    }
    
    let question;
    let i;
    
    // Put sliders in a table at the start, so loop twice with different conditions (but only if they chose that option)
    if (sortScalesSeparately) {
        for (let i = 0; i < questions.length; i++) {
            question = questions[i];
            if (question.displayType !== "slider") continue;
            const fieldHTML = displayHTMLForField(storyModel, question, options, "nobreak");
            formattedFields.push(fieldHTML);
        }
        if (formattedFields.length) formattedFields = [m("table", {"class": "narrafirma-story-card-sliders-table"}, formattedFields), m("br.storyCard")];
    }
    
    for (let i = 0; i < questions.length; i++) {
        question = questions[i];
        if (sortScalesSeparately && question.displayType === "slider") continue;
        let fieldHTML = displayHTMLForField(storyModel, question, options);
        if (!sortScalesSeparately && question.displayType === "slider") {
            fieldHTML = [m("div", {"class": "narrafirma-story-card-question-line-with-slider"}, m("table", {"class": "narrafirma-story-card-one-slider-table"}, fieldHTML))];
        }
        formattedFields.push(fieldHTML);
    }

    let textForElicitingQuestion: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || questionsToInclude["elicitingQuestion"]) {
        textForElicitingQuestion = m(
            ".narrafirma-story-card-eliciting-question", 
            [wrap("span", "narrafirma-story-card-eliciting-question-name", "Eliciting question: "), 
            elicitingQuestion]);
    }
    
    let textForNumStoriesTold: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || questionsToInclude["numStoriesTold"]) {
        textForNumStoriesTold = m(
            ".narrafirma-story-card-num-stories-question", 
            [wrap("span", "narrafirma-story-card-num-stories-question-name", "Number of stories told by this participant: "), 
            numStoriesTold]);
    }

    let textForStoryLength: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || questionsToInclude["storyLength"]) {
        textForStoryLength = m(
            ".narrafirma-story-card-story-length-question", 
            [wrap("span", "narrafirma-story-card-story-length-question-name", "Story length: "), 
            storyLength, " characters", m("br.storyCard")]);
    }

    let textForCollectionDate: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || questionsToInclude["collectionDate"]) {
        textForCollectionDate = m(
            ".narrafirma-story-card-collection-date-question", 
            [wrap("span", "narrafirma-story-card-collection-date-question-name", "Collection date: "), 
            storyCollectionDate, m("br.storyCard")]);
    }
    let textForLanguage: any = [];
    // if questionsToInclude is unspecified, it is not being called in the "print story cards" page, so include this
    if (!questionsToInclude || questionsToInclude["language"]) {
        textForCollectionDate = m(
            ".narrafirma-story-card-language-question", 
            [wrap("span", "narrafirma-story-card-language-question-name", "Language: "), 
            language, m("br.storyCard")]);
    }
    
    let storyTextAtTop: any = [];
    let storyTextClass = "";
    if (options["location"] && options["location"] === "storyBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-browser";
    } else if (options["location"] && options["location"] === "storyAnnotationBrowser") {
        storyTextClass = "narrafirma-story-card-story-text-in-story-annotation-browser";
    } else {
        storyTextClass = "narrafirma-story-card-story-text-in-printed-story-cards";
    }
    let storyTextAtBottom = null;
    if (options.blankLineAfterStory) {
        // the empty line is for copying into word processors, so there is a blank line after the story
        storyTextAtBottom = [wrap("div", storyTextClass, storyText), m("br.storyCard")];
    } else {
        storyTextAtBottom = wrap("div", storyTextClass, storyText);
    }
    
    if (options.storyTextAtTop) {
        storyTextAtTop = storyTextAtBottom;
        storyTextAtBottom = [];
    }

    let bottomHrDiv: any = [];
    if (options.hrAtBottom) {
        bottomHrDiv = m("hr.storyCardForPrinting");
    }
    
    const storyCardContent = m("div.storyCard", [
        wrap("div", "narrafirma-story-card-story-title", m("b", storyName)),
        storyTextAtTop,
        formattedFields,
        storyTextAtBottom,
        textForElicitingQuestion,
        textForNumStoriesTold,
        textForStoryLength,
        textForCollectionDate,
        textForLanguage,
        options.includeIndex ? m("div.narrafirma-story-card-story-number", "#" + storyModel.indexInStoryCollection()) : "",
        bottomHrDiv
    ]);
    
    return storyCardContent;
}
