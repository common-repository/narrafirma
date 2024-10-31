import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// TODO: Fix mixed tabs and spaces and remove part of next line which disables indent check
/* tslint:disable:max-line-length indent */

// TODO: Note everything has a shortName; id currently being used in those cases; do we really need both id and shortName?

const templates = [
    {
        "id": "elicitationQuestions",
        "name": "Elicitation questions",
        "questions": [
            {
                "id": "topic_timeWhenYouFelt",
                "shortName": "When you felt",
                "text": "Was there ever a time when you felt _____? What happened then?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_everThought",
                "shortName": "Ever thought",
                "text": "Have you ever thought ____? What happened that made you think that?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_causedAChange",
                "shortName": "Caused a change",
                "text": "Was there ever a change in your ___ about ___? What happened that caused the change?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_doingSomethingBecauseYouFelt",
                "shortName": "Doing something because you felt",
                "text": "Can you remember ever ____ because you felt ___? What happened that made you feel that way?",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "topic_aTimeWhenYouSomethingBecauseOf",
                "shortName": "A time when you something because of",
                "text": "Think of a time when you ____ because of ____.",
                "category": "Topic",
                "type": "label"
            },
            {
                "id": "time_whatHappenedFirstTime",
                "shortName": "What happened first time",
                "text": "What happened the (first, last, most recent) time you ____?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_aboutYourSomething",
                "shortName": "About your something",
                "text": "Tell me about your ___. What happened during it?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_whatJustHappened",
                "shortName": "What just happened",
                "text": "What just happened? Can you tell us about it?",
                "category": "Point in time (specific)",
                "type": "label"
            },
            {
                "id": "time_mostMemorable",
                "shortName": "Most memorable",
                "text": "What was the most memorable ___ during ____?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_standsOutInMemory",
                "shortName": "Stands out in memory",
                "text": "Was there a time during ___ that stands out in your memory?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_momentWasMostSomething",
                "shortName": "Moment was most something",
                "text": "What moment during ___ was most ____ to you? What happened in that moment?",
                "category": "Point in time (memorable)",
                "type": "label"
            },
            {
                "id": "time_happenedThatMadeYouFeel",
                "shortName": "Happened that made you feel",
                "text": "During ____, did anything happen that made you feel ___? What was it that happened?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_mostSomethingHour",
                "shortName": "Most something hour",
                "text": "What has been your (most, least) ___ hour as a ____?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_whenYouFelt",
                "shortName": "When you felt",
                "text": "Was there ever a time during ____ when you felt ___? What happened that made you feel that way?",
                "category": "Point in time (emotion)",
                "type": "label"
            },
            {
                "id": "time_feltTopicWas",
                "shortName": "Felt topic was",
                "text": "Was there ever a moment when you felt that (a project topic) was ___?",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "time_foundYourselfMost",
                "shortName": "Found yourself most",
                "text": "At what point during ____ did you find yourself the most (project topic)?",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "time_emotionWasInState",
                "shortName": "Emotion was in state",
                "text": "Recall for us a moment when (an emotion) was (in a state) during ____.",
                "category": "Point in time (topic)",
                "type": "label"
            },
            {
                "id": "event_standsOut",
                "shortName": "Stands out",
                "text": "What event most stands out in your mind during ____?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_willRemember",
                "shortName": "Will remember",
                "text": "Did anything happen (today, this week, etc) that you will remember for a long time?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_importantToYou",
                "shortName": "Important to you",
                "text": "Can you describe an incident in the past (day, week, etc) that is important to you?",
                "category": "Event (memorable)",
                "type": "label"
            },
            {
                "id": "event_causedToFeel",
                "shortName": "Caused to feel",
                "text": "Did any particular event or incident cause you to feel ___ during ____?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_feltSomething",
                "shortName": "Felt something",
                "text": "Tell me about a time when you felt ____. What happened?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_feltSomethingWasSomething",
                "shortName": "Felt something was something",
                "text": "Can you recall a situation when you felt that ____ was _____?",
                "category": "Event (emotion)",
                "type": "label"
            },
            {
                "id": "event_proverb",
                "shortName": "Proverb",
                "text": "When you consider the (motto, saying, proverb) ____, was there a moment during ____ when you felt that this (motto, saying, proverb) was especially ____?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "event_situationInWhich",
                "shortName": "Situation in which",
                "text": "Could you tell us about a situation in which ___ was ____?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "event_madeYouThink",
                "shortName": "Made you think",
                "text": "Did you ever experience anything that made you think ____? What happened?",
                "category": "Event (topic)",
                "type": "label"
            },
            {
                "id": "extreme_highOrLowPoint",
                "shortName": "High or low point",
                "text": "Can you recall the (highlight, lowest point) of ___?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_bestOrWorstThing",
                "shortName": "Best or worst thing",
                "text": "What was the (best, worst) thing that ever happened during ____?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_bestOrWorstMoment",
                "shortName": "Best or worst moment",
                "text": "What was the (best, worst) moment of ____?",
                "category": "Extreme (in general)",
                "type": "label"
            },
            {
                "id": "extreme_feltTheMost",
                "shortName": "Felt the most",
                "text": "During ____, when did you feel the most ___? What happened that made you feel that way?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_saidToYourself",
                "shortName": "Said to yourself",
                "text": "During ____, did you ever say to yourself, \"This the ____ moment in this ____?\" What happened during that moment?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_highOrLowLevel",
                "shortName": "High or low level",
                "text": "What was the (highest, lowest) level of ____ you felt during ____? What happened when you felt that?",
                "category": "Extreme (emotion)",
                "type": "label"
            },
            {
                "id": "extreme_thinkBackOver",
                "shortName": "Think back over",
                "text": "Think back over ___. When was ___ the most ____? What happened then?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "extreme_neverSeenSuch",
                "shortName": "Never seen such",
                "text": "Did you ever think, \"I've never seen such ___\"? What happened that made you think that?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "extreme_momentYouCanRecall",
                "shortName": "Moment you can recall",
                "text": "As you look back on ____, what is the ____ moment you can recall with respect to ____? What happened during that moment?",
                "category": "Extreme (topic)",
                "type": "label"
            },
            {
                "id": "surprise_timeWhenSurprised",
                "shortName": "Time when surprised",
                "text": "Can you remember a time when you were surprised at how ____?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "surprise_somethingSurprisedYou",
                "shortName": "Something surprised you",
                "text": "As you remember ____, can you think of a time when ___ surprised you?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "surprise_aSurprisingSomething",
                "shortName": "A surprising something",
                "text": "Can you tell us about a surprising ____ during ____?",
                "category": "Surprise",
                "type": "label"
            },
            {
                "id": "change_momentOfChange",
                "shortName": "Moment of change",
                "text": "Was there ever a moment during ___ when ___ changed? What happened?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "change_feelAChange",
                "shortName": "Feel a change",
                "text": "Did you ever feel a change in ____? What caused you to feel that a change was taking place?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "change_turningPoint",
                "shortName": "Turning point",
                "text": "Looking back over ____, can you pick out a turning point in ____? What happened during that turning point?",
                "category": "Change",
                "type": "label"
            },
            {
                "id": "person_whenMetPerson",
                "shortName": "When met person",
                "text": "What was it like the ____ time you met ___? What happened?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "person_timeYouDidSomethingWithPerson",
                "shortName": "Time you did something with person",
                "text": "Can you tell us about the ___ when you ___ with ___?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "person_bestExplains",
                "shortName": "Best explains",
                "text": "What experience with ____ best explains ____?",
                "category": "Person",
                "type": "label"
            },
            {
                "id": "group_joinedOrLeft",
                "shortName": "Joined or left",
                "text": "Do you remember the ___ when you (joined, left, did something with) ___? What happened during that ___?",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "group_decisionTo",
                "shortName": "Decision to",
                "text": "Can you remember making the decision to ___ with ____? What were you thinking about at the time?",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "group_standsOut",
                "shortName": "Stands out",
                "text": "Recall a ___ with ___ that stands out in your memory.",
                "category": "Group",
                "type": "label"
            },
            {
                "id": "place_didSomethingAt",
                "shortName": "Did something at",
                "text": "Do you remember the ___ time you ___ at ___? What happened?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "place_rememberHappening",
                "shortName": "Remember happening",
                "text": "When you (arrived at, left, did something at) ____, what do you remember happening?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "place_madeYouThink",
                "shortName": "Made you think",
                "text": "Did anything ever happen at ___ that made you think: that's what this place is like? What was it?",
                "category": "Place",
                "type": "label"
            },
            {
                "id": "object_momentSpringsToMind",
                "shortName": "Moment springs to mind",
                "text": "When you look at this ___, what moment springs to mind?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "object_whatWereYouThinking",
                "shortName": "What were you thinking",
                "text": "When you first saw ____, what were you thinking? What happened during that encounter?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "object_especiallySomethingMoments",
                "shortName": "Especially something moments",
                "text": "Can you recall any especially _____ moments (using, holding, etc) this ____?",
                "category": "Object",
                "type": "label"
            },
            {
                "id": "scenario_aboutTo",
                "shortName": "About to",
                "text": "If someone told you that they were about to ___, what story about your experiences with ___ would you tell them?",
                "category": "Fictional scenario",
                "type": "label"
            },
            {
                "id": "scenario_someoneTellsYou",
                "shortName": "Someone tells you",
                "text": "Say someone tells you that ___. Say you want to ___. What would you tell them about your experiences with ___ to ___ them?",
                "category": "Fictional scenario",
                "type": "label"
            },
            {
                "id": "scenario_yearsInThe",
                "shortName": "Years in the",
                "text": "If you found yourself suddenly ____ years in the ___, what would you tell people about your experiences with ____ that would help them understand?",
                "category": "Fictional scenario",
                "type": "label"
            }
        ]
    },
    {
        "id": "storyQuestions",
        "name": "Story questions",
        "questions": [
            {
                "id": "howFeel",
                "text": "How do you feel about this story?",
                "shortName": "Feel about",
                "category": "Value",
                "type": "select",
                "options": "happy;sad;angry;relieved;enthused;indifferent;not sure"
            },
            {
                "id": "emotionalIntensity",
                "text": "How would you rate the emotional intensity of this story?",
                "shortName": "Emotional intensity",
                "category": "Value",
                "type": "slider",
                "options": "strongly negative;strongly positive"
            },
            {
                "id": "howMemorable",
                "text": "How long do you think you will remember this story?",
                "shortName": "How memorable",
                "category": "Value",
                "type": "slider",
                "options": "I've already forgotten it;I'll remember it all my life"
            },
            {
                "id": "howImportantToMe",
                "text": "How important is this story to you? How much does it matter?",
                "shortName": "How important to me",
                "category": "Value",
                "type": "slider",
                "options": "trivial;huge"
            },
            {
                "id": "howImportantToOthers",
                "text": "How important do you think this story is to (other people, another group) in (the community or organization)? How much does it matter to them?",
                "shortName": "How important to others",
                "category": "Value",
                "type": "slider",
                "options": "trivial;huge"
            },
            {
                "id": "desiredImportanceToOthers",
                "text": "How important would you like this story to be to (other people, another group) in (the community or organization)? How much do you want it to matter to them?",
                "shortName": "Desired importance to others",
                "category": "Value",
                "type": "slider",
                "options": "trivial;huge"
            },
            {
                "id": "howLongAgo",
                "text": "How long ago did the events in this story take place?",
                "shortName": "How long ago",
                "category": "Setting",
                "type": "slider",
                "options": "ten years;it just happened"
            },
            {
                "id": "duringHistory",
                "text": "At what point during the history of your interaction with (the topic) did the events in this story happen?",
                "shortName": "When during history",
                "category": "Setting",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "whereTookPlace",
                "text": "Where did the events of this story take place?",
                "shortName": "Where took place",
                "category": "Setting",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "timePeriod",
                "text": "Over what period of time did the events in this story take place?",
                "shortName": "Time period",
                "category": "Setting",
                "type": "slider",
                "options": "moments;decades"
            },
            {
                "id": "whatChanged",
                "text": "What changed in this story?",
                "shortName": "What changed",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "whatDidNotChange",
                "text": "What did not change in this story?",
                "shortName": "What did not change",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "whoWasAffectedByChanges",
                "text": "Who was affected by the changes in this story?",
                "shortName": "Who was affected by changes",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "whoWasUnaffectedByChanges",
                "text": "Who was unaffected by the changes in this story?",
                "shortName": "Who was unaffected by changes",
                "category": "Change",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "storyHoldsTogether",
                "text": "How well would you say this story holds together? If it were a machine, how well would it work?",
                "shortName": "Story holds together",
                "category": "Evaluation",
                "type": "slider",
                "options": "horribly;perfectly"
            },
            {
                "id": "storyHasHoles",
                "text": "Is there anything missing from this story? Does it have any holes in it?",
                "shortName": "Story has holes",
                "category": "Evaluation",
                "type": "slider",
                "options": "nothing is missing;there are large gaps in the story"
            },
            {
                "id": "storyRingsTrue",
                "text": "Does this story ring true? Does it match with other stories you know about?",
                "shortName": "Story rings true",
                "category": "Evaluation",
                "type": "slider",
                "options": "it connects perfectly with all other experience;something about it doesn't seem right"
            },
            {
                "id": "elementsConflictHowMuch",
                "text": "How much conflict do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsConflictDescribe",
                "text": "Describe any conflicts you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsCooperationHowMuch",
                "text": "How much cooperation do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsCooperationDescribe",
                "text": "Describe any cooperation you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsDangerHowMuch",
                "text": "How much danger do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsDangerDescribe",
                "text": "Describe any dangers you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsOpportunityHowMuch",
                "text": "How much opportunity do you see in this story?",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "elementsOpportunityDescribe",
                "text": "Describe any opportunities you see in this story.",
                "category": "Elements",
                "type": "textarea"
            },
            {
                "id": "whyTold",
                "text": "Why was this story told?",
                "shortName": "Why told",
                "category": "Origin",
                "type": "select",
                "options": "to educate;to explain;to inform;to persuade;to reminisce;to complain;to entertain;not sure"
            },
            {
                "id": "whereCameFrom",
                "text": "Where did this story come from?",
                "shortName": "Where came from",
                "category": "Origin",
                "type": "select",
                "options": "it happened to me;it happened to someone I know;it happened to someone I don't know;I heard about it;it's a rumor;it's made up;not sure"
            },
            {
                "id": "howTrue",
                "text": "How factually true is this story?",
                "shortName": "How true",
                "category": "Origin",
                "type": "slider",
                "options": "it happened just as it was told;it's totally made up"
            },
            {
                "id": "whyStoryChosen",
                "text": "Why do you think this particular story was chosen to be told just when it was?",
                "shortName": "Why story chosen",
                "category": "Origin",
                "type": "select",
                "options": "it seemed to fit;it followed another story;it needed to be told;the teller wanted to tell it;it seemed helpful;not sure"
            },
            {
                "id": "commonOrRare",
                "text": "Based on what you know of (the community or organization or topic), do you consider the events described in this story to be common or rare?",
                "shortName": "Common or rare",
                "category": "Community",
                "type": "slider",
                "options": "happens to everyone;happens to one in a million"
            },
            {
                "id": "scopeInvolved",
                "text": "What scope of (the community or organization) is involved in this story?",
                "shortName": "Scope involved",
                "category": "Community",
                "type": "slider",
                "options": "one person;everyone"
            },
            {
                "id": "rolesInvolved",
                "text": "Which of these roles were involved in this story?",
                "shortName": "Roles involved",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "groupsInvolved",
                "text": "Which groups of people were involved in this story?",
                "shortName": "Groups involved",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "strengthOfImpactIfHeard",
                "text": "If this story was more widely heard, how strong would its impact be on (the community or organization)?",
                "shortName": "Strength of impact if heard",
                "category": "Community",
                "type": "slider",
                "options": "no impact;it would change everything"
            },
            {
                "id": "impactIfHeard",
                "text": "If this story was more widely heard, what impact would that have on (the community or organization)?",
                "shortName": "Impact if heard",
                "category": "Community",
                "type": "textarea",
                "options": ""
            },
            {
                "id": "groupsNeedToHearStory",
                "text": "Which of these groups particularly need to hear this story?",
                "shortName": "Groups need to hear story",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "groupsHaveNotHeardStory",
                "text": "Which of these groups is not likely to have ever heard this type of story before?",
                "shortName": "Groups have never heard story",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "groupsWillNotHearStory",
                "text": "In which of these groups will people refuse to hear this story?",
                "shortName": "Groups will not hear story",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "groupsWillGetNewEnergy",
                "text": "To which of these groups will this story give new energy to solve problems?",
                "shortName": "Groups will get new energy",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "groupsWillLoseEnergy",
                "text": "For which of these groups will this story drain their energy?",
                "shortName": "Groups will lose energy",
                "category": "Community",
                "type": "checkboxes",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "storySaysAbout",
                "text": "What does this story say to you about (rules, cooperation, trust, power, etc)?",
                "shortName": "Story says about",
                "category": "Community",
                "type": "textarea",
                "options": ""
            },
            {
                "id": "storySaysToOthersAbout",
                "text": "What do you think this story says to (other people, another group) about (rules, cooperation, trust, power, etc)?",
                "shortName": "Story says to others about",
                "category": null,
                "type": "textarea",
                "options": ""
            },
            {
                "id": "otherViewsOnValue",
                "text": "Do you think (other people, another group) in (the community or organization) would say that this story turned out well?",
                "shortName": "Other views on value",
                "category": "Other views",
                "type": "slider",
                "options": "they would say it turned out horribly;they would say it turned out perfectly"
            },
            {
                "id": "otherViewsOnCommonality",
                "text": "Do you think (other people, another group) in (the community or organization) would say the events in this story were common?",
                "shortName": "Other views on commonality",
                "category": "Other views",
                "type": "slider",
                "options": "they would say it was common;they would say it was rare"
            },
            {
                "id": "otherViewsOnWhyTold",
                "text": "Why do you think (other people, another group) in (the community or organization) would say this story was told?",
                "shortName": "Other views on why told",
                "category": "Other views",
                "type": "select",
                "options": "to educate;to explain;to inform;to persuade;to reminisce;to complain;to entertain;not sure"
            },
            {
                "id": "otherViewsOnMemorability",
                "text": "How long do you think (other people, another group) in (the community or organization) would remember this story?",
                "shortName": "Other views on memorability",
                "category": "Other views",
                "type": "slider",
                "options": "they would have forgotten it already;they would remember it all of their lives"
            },
            {
                "id": "feelingsAboutOtherViewsOnValue",
                "text": "Would you like (other people, another group) in (the community or organization) to say that this story turned out well?",
                "shortName": "Feelings about other views on value",
                "category": "Feelings about other views",
                "type": "slider",
                "options": "I would like them to say that it turned out horribly;I would like them to say that it turned out perfectly"
            },
            {
                "id": "feelingsAboutOtherViewsOnCommonality",
                "text": "Would you like (other people, another group) in (the community or organization) to say that the events in this story were common?",
                "shortName": "Feelings about other views on commonality",
                "category": "Feelings about other views",
                "type": "slider",
                "options": "I would like them to say it was common;I would like them to say it was rare"
            },
            {
                "id": "feelingsAboutOtherViewsOnWhyTold",
                "text": "What would you like (other people, another group) in (the community or organization) to say about why this story was told?",
                "shortName": "Feelings about other views on why told",
                "category": "Feelings about other views",
                "type": "select",
                "options": "to educate;to explain;to inform;to persuade;to reminisce;to complain;to entertain;not sure"
            },
            {
                "id": "feelingsAboutOtherViewsOnMemorability",
                "text": "How long would you like (other people, another group) in (the community or organization) to remember this story?",
                "shortName": "Feelings about other views on memorability",
                "category": "Feelings about other views",
                "type": "slider",
                "options": "I would like them have forgotten it already;I would like them to remember it all of their lives"
            },
            {
                "id": "topicWouldYouSay",
                "text": "Would you say that the people in this story ____?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicFeltAbout",
                "text": "What do you think the people in this story felt about ____?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicMoreOrLess",
                "text": "Did this story make you feel more or less ___ about ___?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicSayToYou",
                "text": "What does this story say to you about ____?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicChangeHowYouSee",
                "text": "Does this story change how you see ___? If so, how?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "topicChooseAStory",
                "text": "If you were to choose a story to tell about ____, would you choose this one? Why or why not?",
                "category": "Project topics",
                "type": "textarea"
            },
            {
                "id": "mainCharacter",
                "text": "Who (or what) was the main character in this story? Who was it about?",
                "shortName": "Main character",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "endedWell",
                "text": "From the perspective of this story's main character, would you say the story ended well or badly?",
                "shortName": "Ended well",
                "category": "Main character",
                "type": "slider",
                "options": "horribly;perfectly"
            },
            {
                "id": "wantOrNeed",
                "text": "In this story, what did the main character want or need?",
                "shortName": "Want or need",
                "category": "Main character",
                "type": "select",
                "options": "resources;help;support;information;respect;trust;not sure"
            },
            {
                "id": "strengthOfWant",
                "text": "How much did the story's main character want or need what they wanted or needed?",
                "shortName": "Strength of want",
                "category": "Main character",
                "type": "slider",
                "options": "not at all;too much"
            },
            {
                "id": "gotWhatWanted",
                "text": "Did the story's main character get what they wanted or needed?",
                "shortName": "Got what wanted",
                "category": "Main character",
                "type": "slider",
                "options": "nothing at all;too much"
            },
            {
                "id": "whoHelped",
                "text": "Who or what helped the story's main character get what they wanted or needed?",
                "shortName": "Helped",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "amountOfHelp",
                "text": "How much help did the main character get?",
                "shortName": "Amount of help",
                "category": "Main character",
                "type": "slider",
                "options": "none;more than they needed"
            },
            {
                "id": "whoHindered",
                "text": "Who or what hindered the story's main character in getting what they wanted or needed?",
                "shortName": "Hindered",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            },
            {
                "id": "amountOfHindrance",
                "text": "How much hindrance did the main character face in getting what they needed?",
                "shortName": "Amount of hindrance",
                "category": "Main character",
                "type": "slider",
                "options": "none;a crushing amount"
            },
            {
                "id": "thingsThatWouldHaveHelped",
                "text": "Which of these things, if they had been available to the main character of the story, would have helped them to get what they wanted or needed?",
                "shortName": "Would have helped",
                "category": "Main character",
                "type": "select",
                "options": "fill in your own relevant choices;not sure"
            }
        ]
    },
    {
        "id": "participantQuestions",
        "name": "Participant questions",
        "questions": [
            // opinions
            {
                "id": "supportForPolicy",
                "text": "To what extent do you support [the/our] policy [of/on] ___?",
                "shortName": "Support",
                "category": "Opinions",
                "type": "slider",
                "options": "I fully support it;I am actively working to change it"
            },
            {
                "id": "feelAboutIssue",
                "text": "How do you feel about ___?",
                "shortName": "Feel about issue scale",
                "category": "Opinions",
                "type": "slider",
                "options": "It is harmful;It is helpful"
            },
            {
                "id": "feelAboutIssueChoices",
                "text": "Which of these statements best describes how you feel about ___?",
                "shortName": "Feel about issue",
                "category": "Opinions",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "ifCouldWriteLaw",
                "text": "If you could write a law or agreement regulating ___, what would it say?",
                "shortName": "Law",
                "category": "Opinions",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "whatCausesProblem",
                "text": "What do you think causes ___?",
                "shortName": "Cause",
                "category": "Opinions",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "whatCouldSolveProblem",
                "text": "What do you think would solve the problem of ___?",
                "shortName": "Solution",
                "category": "Opinions",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "futureCourse",
                "text": "What do you think ___ will be like in ___ years?",
                "shortName": "Future course",
                "category": "Opinions",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "pastOrFuture",
                "text": "With regard to ___, do you think ___ is more focused on the past or the future?",
                "shortName": "Past or future",
                "category": "Opinions",
                "type": "slider",
                "options": "Deep in the past;far into the future"
            },
            {
                "id": "listening",
                "text": "Do people in ___ listen to each other, in your experience?",
                "shortName": "Listening",
                "category": "Opinions",
                "type": "slider",
                "options": "No, never;Yes, always"
            },
            {
                "id": "cooperating",
                "text": "Do people in ___ cooperate with each other, in your experience?",
                "shortName": "Cooperating",
                "category": "Opinions",
                "type": "slider",
                "options": "No, never;Yes, always"
            },
            {
                "id": "conflict",
                "text": "How much conflict have you seen in ___, in general?",
                "shortName": "Cooperating",
                "category": "Opinions",
                "type": "slider",
                "options": "No conflict at all;Crippling amounts of conflict"
            },
            {
                "id": "innovation",
                "text": "In your experience, [is/are] ___ an innovative ___ with regard to ___?",
                "shortName": "Innovation",
                "category": "Opinions",
                "type": "slider",
                "options": "Not at all;Perfectly innovative"
            },
            {
                "id": "openness",
                "text": "In your experience, [is/are] ___ open to new ideas?",
                "shortName": "Innovation",
                "category": "Opinions",
                "type": "slider",
                "options": "No, never;Yes, perfectly open"
            },
            // situation
            {
                "id": "satisfaction",
                "text": "How happy are you with your current ___?",
                "shortName": "Satisfaction",
                "category": "Situation",
                "type": "slider",
                "options": "I never want it to change;I am actively seeking change"
            },
            {
                "id": "reasonsToStayOrLeave",
                "text": "If you want to stay or leave in ___, why is that?",
                "shortName": "Reasons to stay or leave",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "position",
                "text": "What is your position in ___?",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "officialPosition",
                "text": "What is your official position in ___?",
                "shortName": "Official position",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "unofficialPosition",
                "text": "Do you hold an unofficial position in ___?",
                "shortName": "Unofficial position",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "aloneOrTogether",
                "text": "Do you ___ alone or with other people?",
                "shortName": "Alone or together",
                "category": "Situation",
                "type": "slider",
                "options": "only by myself;only with others"
            },
            {
                "id": "aloneOrTogetherPreference",
                "text": "Which do you like better, ___ alone or together?",
                "shortName": "Alone or together preference",
                "category": "Preferences",
                "type": "slider",
                "options": "only by myself;only with others"
            },
            {
                "id": "independence",
                "text": "When it comes to ___, do you decide what will happen next, or does someone else decide that?",
                "shortName": "Independence",
                "category": "Situation",
                "type": "slider",
                "options": "I decide everything;I decide nothing"
            },
            {
                "id": "independencePreference",
                "text": "When it comes to ___, to what extent do you prefer to ___ independently?",
                "shortName": "Independence preference",
                "category": "Preferences",
                "type": "slider",
                "options": "I want to decide everything;I want to have others decide for me"
            },
            {
                "id": "manageOthers",
                "text": "Do you [manage, supervise, take care of] other people? If so, how?",
                "shortName": "Manage others",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "manageNumber",
                "text": "How many people do you [manage, supervise, take care of]?",
                "shortName": "Manage number",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "structure",
                "text": "How structured is your [work/life/___]?",
                "shortName": "Structure",
                "category": "Situation",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "freedomToChoose",
                "text": "With regard to ___, do you feel that you have a lot of freedom to make your own choices?",
                "shortName": "Freedom to choose",
                "category": "Situation",
                "type": "slider",
                "options": "I have complete freedom;I have no freedom"
            },
            // demographics
            {
                "id": "ageRange",
                "text": "Which age range do you fall into?",
                "shortName": "Age",
                "category": "Demographics",
                "type": "select",
                "options": "<25;25-34;35-44;45-64;65-74;75+"
            },
            {
                "id": "gender",
                "text": "What is your gender?",
                "category": "Demographics",
                "type": "select",
                "options": "male;female"
            },
            {
                "id": "rentOrOwn",
                "text": "Do you rent or own your home?",
                "shortName": "Rent or own",
                "category": "Demographics",
                "type": "select",
                "options": "rent;own"
            },
            {
                "id": "incomeLevel",
                "text": "What is your income level?",
                "shortName": "Income level",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "educationLevel",
                "text": "How much formal education have you completed?",
                "shortName": "Formal education",
                "category": "Demographics",
                "type": "select",
                "options": "no formal schooling;a little;elementary school;high school;college;post-graduate;trade;other;rather not say"
            },
            {
                "id": "informalEducation",
                "text": "How much informal education have you had?",
                "shortName": "Informal education",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "experience",
                "text": "How much experience have you had with ___?",
                "shortName": "Experience",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "maritalStatus",
                "text": "What is your marital status?",
                "shortName": "Marital status",
                "category": "Demographics",
                "type": "select",
                "options": "single;living together;married;widowed;divorced;other"
            },
            {
                "id": "children",
                "text": "How many children do you have?",
                "shortName": "How many children",
                "category": "Demographics",
                "type": "select",
                "options": "none;1;2;3;4;5;6;7;8;9;10;other"
            },
            {
                "id": "describeChildren",
                "text": "How would you describe your children?",
                "shortName": "Children description",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "profession",
                "text": "What is your profession?",
                "shortName": "Profession",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "location",
                "text": "Where do you live?",
                "shortName": "Location",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            {
                "id": "ethnicBackground",
                "text": "What is your ethnic background?",
                "shortName": "Background",
                "category": "Demographics",
                "type": "select",
                "options": "fill in your own relevant choices;not sure;rather not say"
            },
            // personality
            {
                "id": "opennessToExperience",
                "text": "Do you like trying new things?",
                "shortName": "Openness to experience",
                "category": "Personality",
                "type": "slider",
                "options": "I like things to stay the same;if it's new I'm for it"
            },
            {
                "id": "selfDisciplined",
                "text": "Would you call yourself self-disciplined?",
                "shortName": "Self-disciplined",
                "category": "Personality",
                "type": "slider",
                "options": "I always do exactly what I should;I have no control over myself"
            },
            {
                "id": "introvertOrExtravert",
                "text": "Are you more of an extravert or an introvert?",
                "shortName": "Introvert or extravert",
                "category": "Personality",
                "type": "slider",
                "options": "introverted;extraverted"
            },
            {
                "id": "agreeableness",
                "text": "How do you feel about other people?",
                "shortName": "Agreeableness",
                "category": "Personality",
                "type": "slider",
                "options": "heaven is other people;hell is other people"
            },
            {
                "id": "neuroticism",
                "text": "How much do you worry?",
                "shortName": "Neuroticism",
                "category": "Personality",
                "type": "slider",
                "options": "constantly;me? never"
            },
            {
                "id": "sensingVsIntuition",
                "text": "Do you prefer to think of abstract, \"big picture\" ideas, or do you like concrete, practical applications?",
                "shortName": "Sensing vs intuition",
                "category": "Personality",
                "type": "slider",
                "options": "I like the big picture;give me concrete details"
            },
            {
                "id": "thinkingVsFeeling",
                "text": "Does logic or emotion have more impact on your decisions?",
                "shortName": "Thinking vs feeling",
                "category": "Personality",
                "type": "slider",
                "options": "logic and reason only;my values and feelings are my guide"
            },
            {
                "id": "judgingVsPerceiving",
                "text": "How do you feel about rules?",
                "shortName": "Judging vs perceiving",
                "category": "Personality",
                "type": "slider",
                "options": "rules keep life working;rules are for breaking"
            }
        ]
    },
    {
        "id": "annotationQuestions",
        "name": "Annotation questions",
        "questions": [
            {
                "id": "typeOfText",
                "text": "Was this story a recounting of events? If not, what was it?",
                "shortName": "Type of text",
                "category": "Narrative analysis",
                "type": "select",
                "options": "recounting;situation;scenario;fact;explanation;argument;opinion"
            },
            {
                "id": "greimas_subject",
                "text": `The actantial model of narrative analysis (by A.J. Greimas) proposes that every story has six facets, called actants, divided into axial pairs. 
                    On the axis of desire are the subject (who the story is about) and the object (what that person wants).
                    Who or what did the storyteller represent as the subject in this story? (fill in answers as you go)`,
                "shortName": "Subject",
                "category": "Narrative analysis",
                "type": "select",
                "options": ""
            },
            {
                "id": "greimas_object",
                "text": `The actantial model of narrative analysis (by A.J. Greimas) proposes that every story has six facets, called actants, divided into axial pairs. 
                    On the axis of desire are the subject (who the story is about) and the object (what that person wants).
                    Who or what did the storyteller represent as the object in this story? (fill in answers as you go)`,
                "shortName": "Object",
                "category": "Narrative analysis",
                "type": "select",
                "options": ""
            },
            {
                "id": "greimas_sender",
                "text": `The actantial model of narrative analysis (by A.J. Greimas) proposes that every story has six facets, called actants, divided into axial pairs. 
                    On the axis of knowledge are the sender (who initiates the action of the story) and the receiver (who profits from the action of the story).
                    Who or what did the storyteller represent as the sender in this story? (fill in answers as you go)`,
                "shortName": "Sender",
                "category": "Narrative analysis",
                "type": "select",
                "options": ""
            },
            {
                "id": "greimas_receiver",
                "text": `The actantial model of narrative analysis (by A.J. Greimas) proposes that every story has six facets, called actants, divided into axial pairs. 
                    On the axis of knowledge are the sender (who initiates the action of the story) and the receiver (who profits from the action of the story).
                    Who or what did the storyteller represent as the receiver in this story? (fill in answers as you go)`,
                "shortName": "Receiver",
                "category": "Narrative analysis",
                "type": "select",
                "options": ""
            },
            {
                "id": "greimas_helper",
                "text": `The actantial model of narrative analysis (by A.J. Greimas) proposes that every story has six facets, called actants, divided into axial pairs. 
                    On the axis of power are the helper (who helps the subject achieve or obtain the object) and the opponent (who tries to prevent this).
                    Who or what did the storyteller represent as the helper in this story? (fill in answers as you go)`,
                "shortName": "Helper",
                "category": "Narrative analysis",
                "type": "select",
                "options": ""
            },
            {
                "id": "greimas_opponent",
                "text": `The actantial model of narrative analysis (by A.J. Greimas) proposes that every story has six facets, called actants, divided into axial pairs. 
                    On the axis of power are the helper (who helps the subject achieve or obtain the object) and the opponent (who tries to prevent this).
                    Who or what did the storyteller represent as the opponent in this story? (fill in answers as you go)`,
                "shortName": "Opponent",
                "category": "Narrative analysis",
                "type": "select",
                "options": ""
            },


            {
                "id": "scope",
                "text": "How many people were mentioned in this story?",
                "shortName": "Scope",
                "category": "Facts",
                "type": "select",
                "options": "individual;pair;team;group;department;division;organization;industry;street;neighborhood;community;society"
            },
            {
                "id": "roles",
                "text": "What sorts of official roles were mentioned in this story? (fill in answers as you go)",
                "shortName": "Roles",
                "category": "Facts",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "leaders",
                "text": "What leaders were mentioned in this story? (fill in answers as you go)",
                "shortName": "Leaders",
                "category": "Facts",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "groups",
                "text": "What groups of people were mentioned in this story?  (fill in answers as you go)",
                "shortName": "Groups",
                "category": "Facts",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "locations",
                "text": "What locations were mentioned in this story?  (fill in answers as you go)",
                "shortName": "Locations",
                "category": "Facts",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "rules",
                "text": "What rules or procedures were mentioned in this story?  (fill in answers as you go)",
                "shortName": "Rules",
                "category": "Facts",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "forces",
                "text": "What forces or factors were mentioned in this story?  (fill in answers as you go)",
                "shortName": "Forces",
                "category": "Facts",
                "type": "checkboxes",
                "options": ""
            },



            {
                "id": "formality",
                "text": "How formal or informal was the wording in this story?",
                "shortName": "Formality",
                "category": "Affect",
                "type": "slider",
                "options": "extremely formal;casual, slang"
            },
            {
                "id": "emotion",
                "text": "How strongly worded was this story?",
                "shortName": "Emotion",
                "category": "Affect",
                "type": "slider",
                "options": "dull, bland;very strongly worded"
            },
            {
                "id": "evaluation",
                "text": "To what extent did the storyteller include meta-level proof or evaluation statements in the story?",
                "shortName": "Evaluation",
                "category": "Affect",
                "type": "select",
                "options": "not at all;a little;some;a lot;an extreme amount"
            },
            {
                "id": "value",
                "text": "Did the storyteller seem to think the story turned out well or poorly?",
                "shortName": "Value",
                "category": "Affect",
                "type": "slider",
                "options": "horribly;perfectly"
            },
            {
                "id": "hesitation",
                "text": "To what extent did it seem like the storyteller struggled with how they wanted to tell the story? How often or much did they seem to rephrase or rethink what they said?",
                "shortName": "Hesitation",
                "category": "Affect",
                "type": "select",
                "options": "not at all;a little;some;a lot;an extreme amount"
            },
            {
                "id": "importantWords",
                "text": "Were there any words in the story that seemed especially important to the storyteller?",
                "shortName": "Important words",
                "category": "Affect",
                "type": "text",
                "options": ""
            },

            {
                "id": "themes",
                "text": "What overall themes seemed to be important to the storyteller?  (fill in answers as you go)",
                "shortName": "Themes",
                "category": "Emergent characteristics",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "behaviors",
                "text": "What sorts of behaviors seemed to be important to the storyteller? (fill in answers as you go)",
                "shortName": "Behaviors",
                "category": "Emergent characteristics",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "situations",
                "text": "What sorts of situations seemed to be important to the storyteller? (fill in answers as you go)",
                "shortName": "Situations",
                "category": "Emergent characteristics",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "values",
                "text": "What sorts of values seemed to be important to the storyteller? (fill in answers as you go)",
                "shortName": "Values",
                "category": "Emergent characteristics",
                "type": "checkboxes",
                "options": ""
            },
            {
                "id": "conflicts",
                "text": "What sorts of conflicts seemed to be important to the storyteller? (fill in answers as you go)",
                "shortName": "Conflicts",
                "category": "Emergent characteristics",
                "type": "checkboxes",
                "options": ""
            }
        ]
    },
    {
        "id": "storyCollectionActivities",
        "name": "Story Collection Activities",
        "questions": [
              {
                  "id": "twoTrueStoriesAndATallTale",
                  "shortName": "Two true stories and a tall tale",
                  "type": "ice-breaker",
                  "plan": "Ask people to break into small groups, and one by one, tell two true stories about themselves and one made-up fiction. Others in the group must guess which of the stories is fiction.",
                  "optionalParts": "Afterwards, have groups tell their favorite stories (true or fictional) to the larger group.",
                  "duration": "Ten to fifteen minutes",
                  "recording": "Not necessary",
                  "materials": "None needed",
                  "spaces": "Places for people to sit in small groups",
                  "facilitation": "None after the setup"
              },

              {
                  "id": "quickInterviews",
                  "shortName": "Quick interviews",
                  "type": "ice-breaker",
                  "plan": "Divide into groups of three. Interview each other using one simple question, like \"When have you felt proud?\"",
                  "optionalParts": "Afterwards, have groups summarize the stories they heard to the larger group",
                  "duration": "Ten to fifteen minutes",
                  "recording": "Not necessary",
                  "materials": "None needed",
                  "spaces": "Places for people to sit in small groups",
                  "facilitation": "None after the setup"
              },
              {
            	  "id": "commonExperiences",
                  "shortName": "Common experiences",
                  "type": "ice-breaker",
                  "plan": "In small groups, find one experience everyone has had in common. If people know each other, the experience has to be surprising.",
                  "optionalParts": "Afterwards, have groups tell about their shared experience.",
                  "duration": "Ten to fifteen minutes",
                  "recording": "Not necessary",
                  "materials": "None needed",
                  "spaces": "Places for people to sit in small groups",
                  "facilitation": "None after the setup"
              },
              {
                  "id": "haveYouEver",
                  "shortName": "Have you ever...",
                  "type": "ice-breaker",
                  "plan": "People say whether they've had experiences on a printed list. Each group is challenged to come up with some surprises about the experiences people have had.",
                  "optionalParts": "Afterwards, have groups explain what surprised them about their experiences.",
                  "duration": "Ten to fifteen minutes",
                  "recording": "Not necessary",
                  "materials": "None needed",
                  "spaces": "Places for people to sit in small groups",
                  "facilitation": "None after the setup"
              },
              {
            	  "id": "thatRemindsMeOf",
                  "shortName": "That reminds me of...",
                  "type": "ice-breaker",
                  "plan": "Each group gets a copy of a newspaper or magazine. Each member must come up with some experience they are reminded of by the paper. The group compares their experiences.",
                  "optionalParts": "Afterwards, have groups explain what surprised them about their experiences.",
                  "duration": "Ten to fifteen minutes",
                  "recording": "Not necessary",
                  "materials": "None needed",
                  "spaces": "Places for people to sit in small groups",
                  "facilitation": "None after the setup"
              },
              {
            	  "id": "twentyQuestions",
                  "shortName": "Twenty questions",
                  "type": "ice-breaker",
                  "plan": "In small groups, each person should think of an experience they've had. The others try to guess what happened by asking twenty questions.",
                  "optionalParts": "Afterwards, have groups explain what surprised them about their experiences.",
                  "duration": "Ten to fifteen minutes",
                  "recording": "Not necessary",
                  "materials": "None needed",
                  "spaces": "Places for people to sit in small groups",
                  "facilitation": "None after the setup"
              },
              {
            	  "id": "sharingStoriesNoTask",
                  "shortName": "Sharing stories",
                  "type": "sharing stories (no task)",
                  "plan": "Ask people in small groups to simply and naturally share stories about a topic.",
                  "optionalParts": "None",
                  "duration": "Ten to thirty minutes",
                  "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Tape recorders; question sheets.",
                  "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
                  "facilitation": "Watch people to make sure they are giving their stories names and paying attention to the question sheets. Make sure people are speaking into the recorders."
              },
              {
            	  "id": "respondToQuestions",
                  "shortName": "Respond to questions",
                  "type": "sharing stories (simple task)",
                  "plan": "Give people (in small groups) a set of 3-5 questions related to the topic." +
                  	"Ask them to one by one choose a question they want to answer and tell a story about it" +
                  	"to the group. Ask them to try to cover all of the questions between them.",
                    "optionalParts": "None",
                  "duration": "Ten to thirty minutes",
                  "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Tape recorders; question sheets.",
                  "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
                  "facilitation": "Watch people to make sure they are giving their stories names and paying attention to the question sheets. Make sure people are speaking into the recorders."
              },
              {
            	  "id": "bothSides",
                  "shortName": "Both sides",
                  "type": "sharing stories (simple task)",
                  "plan": "Give people (in small groups) a set of 3-4 statements related to the topic." +
                  	"The statements should be summaries of \"what happens,\" like \"People in our community " +
                  	"take care of each other.\" Ask people to tell stories that describe experiences on both sides of each " +
                  	"statement. The challenge for the group is to provide balancing examples for each statement.",                 	
                  "optionalParts": "None",
                  "duration": "Ten to thirty minutes",
                  "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Tape recorders; question sheets.",
                  "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
                  "facilitation": "Watch people to make sure they are giving their stories names and paying attention to the question sheets. Make sure people are speaking into the recorders."
              },
              {
            	  "id": "simpleRanking",
                  "shortName": "Simple ranking",
                  "type": "sharing stories (simple task)",
                  "plan": "Ask people in small groups to share stories, either with just a named topic," +
                  	"or with a list of 3-5 questions about the topic. As people tell stories, ask them to " +
                  	"name each story and write the name on a sticky note. Have people arrange the sticky notes " +
                  	"along some axis they have defined. It can be anything that has meaning to the group, such as " +
                  	"how much impact the story would have if it were widely known, or how positive or negative " +
                  	"the story is, or when it happened, or whether it turned out well. Stories should not be ranked by quality." +
                  	"Ask people to fill in empty spaces along their axis, if they can.",
                  "optionalParts": "None",
                  "duration": "Ten to thirty minutes",
                  "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Tape recorders; question sheets.",
                  "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
                  "facilitation": "Watch people to make sure they are giving their stories names and paying attention to the question sheets. Make sure people are speaking into the recorders."
              },
              {
            	  "id": "remindings",
                  "shortName": "Remindings",
                  "type": "sharing stories (simple task)",
                  "plan": "Ask people in small groups to share stories, either with just a named topic," +
	                	"or with a list of 3-5 questions about the topic. After the first story is told, ask people " +
	                	"to respond with another story the first story reminds them of. When people run out of " +
	                	"remindings, they can return to the list. The challenge to the group is to create chains " +
	                	"of reminding.",
	               "optionalParts": "If people like the idea, you can have groups compete over how long their " +
                        "reminding chains grow.",
	               "duration": "Ten to thirty minutes",
	               "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
	               "materials": "Tape recorders; question sheets.",
	               "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
	               "facilitation": "Watch people to make sure they are giving their stories names and paying attention to the question sheets. Make sure people are speaking into the recorders."
              },
              {
            	  "id": "words",
                  "shortName": "Words",
                  "type": "sharing stories (simple task)",
                  "plan": "Give small groups cards with words important to the project written on them." +
                    "Mix together words that bring to mind things like behaviors (helpful, deceitful), situations " +
                    "(conflict, cooperation), values (fairness, equality), and concrete places or objects " +
                    "familiar to people (the town square, the factory floor)." +
                  	"Ask people to shuffle the cards, then deal out cards so that each person gets a random " +
                  	"selection. Ask people to remember and tell about things that have happened that their " +
                  	"cards remind them of. Other group members can also tell stories those stories remind " +
                  	"them of.",
 	               "optionalParts": "None",
	               "duration": "Ten to thirty minutes",
	               "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
	               "materials": "Tape recorders; question sheets.",
	               "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
	               "facilitation": "Watch people to make sure they are giving their stories names and paying attention to the question sheets. Make sure people are speaking into the recorders."
              },
              {
            	  "id": "twiceToldStories",
                  "shortName": "Twice-told stories",
                  "type": "twice-told stories exercise",
                  "plan": "1. (5 min) Introduction. Ask people to form groups of three to four people. Turn on audio recorders. " +
                  		"2. (5 min) Criteria. Each small group should choose a criterion by which they will choose a story they " +
                  		"will tell to the larger group afterward." +
                  		"3. (25 min) Exchange. Small groups exchange stories. As they do this they name the stories, " +
                  		"say the names on the recording, and note them down on their forms. " +
                  		"4. (5 min) Question forms. Each person fills out a question form for each story they told. " +
                  		"5. (15 min) Retelling. One person from each small group retells their chosen story " +
                  		"to the whole session. " +
                  		"6. (5 min) Discussion. Wrap-up and general discussion of all stories told and the topic.",
                  "optionalParts": "Ask people to fill out question sheets about the stories they heard as well as those " +
                  		"they told.",
                  "duration": "One hour",
	              "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "None required",
	              "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
	              "facilitation": "Watch to make sure people are paying attention to the exercise (choosing stories to retell), " +
              			"but keep your distance so people can speak freely."
              },
              {
            	  "id": "twiceToldStoriesShort",
                  "shortName": "Twice-told stories (short version)",
                  "type": "twice-told stories exercise",
                  "plan": "1. (5 min) Introduction and criteria. Ask people to form groups of three to four people. Turn on audio recorders. " +
                  		"Also, each small group should choose a criterion by which they will choose a story they " +
                  		"will tell to the larger group afterward." +
                  		"2. (20 min) Exchange. Small groups exchange stories. As they do this they name the stories, " +
                  		"say the names on the recording, and note them down on their forms. " +
                  		"3. (5 min) Question forms. Each person fills out a question form for each story they told. " +
                  		"4. (10 min) Retelling. One person from each small group retells their chosen story " +
                  		"to the whole session. " +
                  		"5. (5 min) Discussion. Wrap-up and general discussion of all stories told and the topic.",
                  "optionalParts": "None",
                  "duration": "45 minutes",
	              "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "None required",
	              "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
	              "facilitation": "Watch to make sure people are paying attention to the exercise (choosing stories to retell), " +
              			"but keep your distance so people can speak freely."
              },
              {
            	  "id": "timeline",
                  "shortName": "Timeline",
                  "type": "timeline exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
                  		"groups of three or four people each. Turn on audio recorders. " +
                  		"2. (5 min) Topic and dates. Ask each group to agree on a topic their timeline will explore. " +
                  		"Ask each group to choose starting and ending dates for their timeline " +
                  		"and mark these dates with sticky notes. " +
                  		"3. (10 min) Start and end. Ask each group to tell at least three stories that describe the end of the timeline. They should " +
                  		"write a brief title for each story and build a cluster of these notes at the end of the timeline. " +
                  		"Have them do the same for the start of the timeline. " +
                  		"They should also write the story titles on their question answering sheets. " +
                  		"4. (40 min) Filling in. Have each group work backwards through time, telling stories along the way. " +
                  		"Also ask people to mark turning points, or times when things changed in significant ways, on their timeline. " +
                  		"5. (10 min) Question forms. Ask everyone to fill out question forms for every story they told. " +
                  		"6. (10 min). Visiting. Ask everyone to walk around the room looking over all of the timelines created. " +
                  		"7. (10 min). Discussion. Bring everyone together into a discussion of all the timelines.",
                  "optionalParts": "People can create utopian and dystopian timelines, working backward from perfect or " +
                  		"horrible ending states, linking to the factual timeline at some point. (See WWS for details.)",
                  "duration": "90 minutes",
	              "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Sticky notes; spaces to work on (tables, walls, floor)",
	              "spaces": "Places for people to sit in small groups (with enough space between so tape recorders don't pick up too much background noise).",
                  "facilitation": "Watch out for people going into too much detail; people leaving large blank spaces " +
                  		"(perhaps in times they don't want to think about); and people listing facts without telling stories."
               },
               {
            	   "id": "timelineShort",
                   "shortName": "Timeline (short version)",
                   "type": "timeline exercise",
                   "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
                   		"groups of three or four people each. Turn on audio recorders. " +
                   		"2. (5 min) Topics and dates. Ask each group to agree on a topic their timeline will explore. " +
                   		"Ask each group to choose starting and ending dates for their timeline " +
                   		"and mark these dates with sticky notes. " +
                   		"3. (5 min) Start and end. Ask each group to tell at least three stories that describe the end of the timeline. They should " +
                   		"write a brief title for each story and build a cluster of these notes at the end of the timeline. " +
                  		"Have them do the same for the start of the timeline. " +
                   		"They should also write the story titles on their question answering sheets. " +
                   		"4. (20 min) Filling in. Have each group work backwards through time, telling stories along the way. " +
                   		"Also ask people to mark turning points, or times when things changed in significant ways, on their timeline. " +
                   		"5. (5 min) Question forms. Ask everyone to fill out question forms for every story they told. " +
                   		"6. (5 min). Visiting. Ask everyone to walk around the room looking over all of the timelines created.",
                   "optionalParts": "None",
                   "duration": "45 minutes",
 	              "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                   "materials": "Sticky notes",
 	              "spaces": "Places for people to sit in small groups (with enough space between so tape recorders " +
 	              		"don't pick up too much background noise); spaces to work on (tables, walls, floor)",
                   "facilitation": "Watch out for people going into too much detail; people leaving large blank spaces " +
                   		"(perhaps in times they don't want to think about); and people listing facts without telling stories."
                },
                {
                	"id": "landscape",
                    "shortName": "Landscape",
                    "type": "landscape exercise",
                    "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
              		"groups of three or four people each. Turn on audio recorders. " +
              		"2. (5-15 min) Dimensions and corners. Ask each group to mark each axis of the space using dimensions you have chosen. " +
              		"Ask people to label each corner point with descriptions of how the two dimensions come together " +
              		"at that corner." +
              		"3. (40 min) Filling in. Having defined their space, each group will now fill it up with stories. " +
              		"4. (10 min) Features. After groups have populated their spaces, ask them to mark out features of the landscape. " +
              		"5. (10 min) Question forms. Now ask people to pause in their building and answer questions about each story they told. " +
              		"6. (10 min) Visiting. Ask everyone to walk around the room looking over all of the landscapes created and " +
              		"talking about the experiences described there. " +
              		"7. (10 min). Discussion. Bring everyone together into a discussion of all the landscapes.",
                    "optionalParts": "Consider a third dimension; consider multiple perspectives; " +
                    		"ask people to create their own dimensions (see WWS for details).",
                    "duration": "90 minutes",
  	              "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Sticky notes",
 	              "spaces": "Places for people to sit in small groups (with enough space between so tape recorders " +
 	              		"don't pick up too much background noise); spaces to work on (tables, walls, floor)",
                    "facilitation": "Watch out for confusion about the dimensions (and have some on hand in case the first " +
                    		"set doesn't resonate); people leaving some spaces empty; people drawing category boxes " +
                    		"in the space; people listing dry facts just to cover up the space."
                },
              {
                  "id": "landscapeShort",
                  "shortName": "Landscape (short version)",
                  "type": "landscape exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
            		"groups of three or four people each. Turn on audio recorders. " +
            		"2. (5 min) Dimensions and corners. Ask each group to mark each axis of the space using dimensions you have chosen. " +
            		"Ask people to label each corner point with descriptions of how the two dimensions come together " +
            		"at that corner." +
            		"3. (20 min) Filling in. Having defined their space, each group will now fill it up with stories. " +
            		"4. (5 min) Features. After groups have populated their spaces, ask them to mark out features of the landscape. " +
            		"5. (5 min) Question forms. Now ask people to pause in their building and answer questions about each story they told. " +
            		"6. (5 min) Visiting. Ask everyone to walk around the room looking over all of the landscapes created and " +
            		"talking about the experiences described there.",
                  "optionalParts": "None",
                  "duration": "45 minutes",
	              "recording": "Record all stories; ask people to give their stories names; give them question sheets to fill out.",
                  "materials": "Sticky notes",
 	              "spaces": "Places for people to sit in small groups (with enough space between so tape recorders " +
 	              		"don't pick up too much background noise); spaces to work on (tables, walls, floor)",
                  "facilitation": "Watch out for confusion about the dimensions (and have some on hand in case the first " +
                  		"set doesn't resonate); people leaving some spaces empty; people drawing category boxes " +
                  		"in the space; people listing dry facts just to cover up the space."
              }
	    ]
    	
    },

    {
	    "id": "sensemakingActivities",
	    "name": "Sensemaking Activities",
	    "questions": [
              {
            	  "id": "encounterStories",
                  "shortName": "Encounter stories",
                  "type": "encountering stories (no task)",
                  "plan": "Give each small group some stories to consider. If the stories are printed, " +
                    "ask them to read the stories, either quietly or aloud. If the stories are in audio or video form, " +
                    "ask them to listen to or watch the stories together.",
                  "optionalParts": "None",
                  "duration": "Ten to thirty minutes",
                  "recording": "None required",
                  "materials": "Printed, audio, or video stories",
                  "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                    "listening to recordings don't overlap).",
                  "facilitation": "Watch to make sure people are paying attention to the stories, " +
                    "but keep your distance so people can speak freely."
              },
              {
            	  "id": "simpleRanking",
                  "shortName": "Simple ranking",
                  "type": "encountering stories (simple task)",
                  "plan": "Ask each small group to draw a line across a large sheet of paper, or simply use " +
                  		"sticky notes to mark the start and end of a line across the table. " +
                  		"Give each small group some stories to consider. As they read or listen to each story, " +
                  		"ask them to place it somewhere along the line. When they have gone through all the stories, " +
                  		"ask them to talk about the pattern they have created with their placements. ",
                  "optionalParts": "If particular groups finish early, ask them to create a second line, " +
                  		"then move their stories from one line to the other. Then ask them to consider " +
                  		"what they learned from the repositioning of the stories.",
                  "duration": "Ten to thirty minutes",
                  "recording": "None required",
                  "materials": "Printed, audio, or video stories; a surface (wall, table, or floor) to place stories on; paper and/or sticky notes",
                  "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                  		"listening to recordings don't overlap).",
                  "facilitation": "Watch to make sure people are paying attention to the stories, " +
                  		"but keep your distance so people can speak freely."
              },
              {
            	  "id": "bothSides",
                  "shortName": "Both sides",
                  "type": "encountering stories (simple task)",
                  "plan": "Give each group some stories to consider. Ask them to try to find groups of stories " +
                  		"in which the same question is answered differently. " +
                  		"Example questions might be \"How does a citizen behave?\" and \"What is education?\" " +
                  		"Ask people to write these questions " +
                  		"on sticky notes and surround them with the stories that answer them differently. " +
                  		"If a story stands alone, people should still write a question it answers. " +
                  		"If two stories answer the same question in the same way, they can be stacked together. " +
                  		"When all of the stories have been considered, people can stand back and look over " +
                  		"the patterns they have created.",
                  "optionalParts": "None",
                  "duration": "Ten to thirty minutes",
                  "recording": "None required",
                  "materials": "Printed, audio, or video stories; a surface (wall, table, or floor) to place stories on; sticky notes",
                  "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                  		"listening to recordings don't overlap).",
                  "facilitation": "Watch to make sure people are paying attention to the stories, " +
                  		"but keep your distance so people can speak freely."
              },
              {
            	  "id": "remindings",
                  "shortName": "Remindings",
                  "type": "encountering stories (simple task)",
                  "plan": "Give each small group some stories to consider. As they encounter each story, " +
                  		"ask them to think of any other stories it reminds them of. When they find such a " +
                  		"reminding pair, have them place the two stories next to each other, with a sticky note " +
                  		"between them explaining what links the two stories. It might be something simple, like " +
                  		"that they are both about fathers, or something complex, like that in both stories trust " +
                  		"is lacking. When the group has worked their way through all of their stories, ask them " +
                  		"to stand back and look at the pattern they have created.",
                  "optionalParts": "After creating their remindings pattern, people can talk about why some stories " +
                  		"are not connected to any others. What do the unrelated stories have in common?",
	              "duration": "Ten to thirty minutes",
	              "recording": "None required",
	              "materials": "Printed, audio, or video stories; a surface (wall, table, or floor) to place stories on; sticky notes",
	              "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
	                     "listening to recordings don't overlap).",
	              "facilitation": "Watch to make sure people are paying attention to the stories, " +
	                	"but keep your distance so people can speak freely."
              },
              {
            	  "id": "resonance",
                  "shortName": "Resonance",
                  "type": "encountering stories (simple task)",
                  "plan": "Give each small group some stories to consider. As they encounter eacy story, " +
                  		"ask each person to choose some number of stories (perhaps three, five, or seven) they will take " +
                  		"special care to represent in later exercises during the session. They should choose " +
                  		"stories that resonate with their own experiences; stories they want to make sure are " +
                  		"well represented in what is considered; stories whose voices they want to amplify. When the group " +
                  		"has worked their way through all the stories, ask them to talk about the stories they " +
                  		"(each) chose and why they chose them.",
                  "optionalParts": "If there is time, people can also talk about the stories nobody chose, " +
                  		"and why nobody felt those stories resonated with them, and what that might mean.",
  	              "duration": "Ten to thirty minutes",
	              "recording": "None required",
	              "materials": "Printed, audio, or video stories; a surface (wall, table, or floor) to place stories on; sticky notes",
	              "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
	                     "listening to recordings don't overlap).",
	              "facilitation": "Watch to make sure people are paying attention to the stories, " +
	                	"but keep your distance so people can speak freely."
              },
              { 
            	  "id": "twiceToldStories",
                  "shortName": "Twice-told stories",
                  "type": "twice-told stories exercise",
                  "plan": "1. (5 min) Introduction. Ask people to form groups of two to four people. " +
                  		"2. (5 min) Criteria. Each small group should choose a criterion by which they will choose a story they " +
                  		"will tell to the larger group afterward." +
                  		"3. (5 min) Critique. Groups present their criteria to the room for critique. " +
                  		"4. (20 min) Encounter. Small groups read or listen to stories. As they do this, they choose which story " +
                  		"they will retell to the larger group. " +
                  		"5. (20 min) Retelling. One person from each small group retells their chosen story " +
                  		"to the whole session. " +
                  		"6. (5 min) Discussion. Wrap-up and general discussion of all stories told and the topic.",
                  "optionalParts": "None",
                  "duration": "One hour",
	              "recording": "None required",
                  "materials": "None required",
	              "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
	                     "listening to recordings don't overlap).",
	              "facilitation": "Watch to make sure people are paying attention to the exercise (choosing stories to retell), " +
              			"but keep your distance so people can speak freely."
              },
              { 
            	  "id": "twiceToldStoriesShort",
                  "shortName": "Twice-told stories (short version)",
                  "type": "twice-told stories exercise",
                  "plan": "1. (5 min) Introduction and criteria. Ask people to form groups of two to four people. " +
                  		"Also, each small group should choose a criterion by which they will choose a story they " +
                  		"will tell to the larger group afterward." +
                  		"2. (20 min) Encounter. Small groups read or listen to stories. As they do this, they choose which story " +
                  		"they will retell to the larger group. " +
                  		"3. (15 min) Retelling. One person from each small group retells their chosen story " +
                  		"to the whole session. " +
                  		"4. (5 min) Discussion. Wrap-up and general discussion of all stories told and the topic.",
                  "optionalParts": "None",
                  "duration": "45 minutes", 
	              "recording": "None required",
                  "materials": "None required",
	              "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
	                     "listening to recordings don't overlap).",
	              "facilitation": "Watch to make sure people are paying attention to the exercise (choosing stories to retell), " +
              			"but keep your distance so people can speak freely."
              },
              {
            	  "id": "timeline",
                  "shortName": "Timeline",
                  "type": "timeline exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
                  		"groups of three or four people each. " +
                  		"2. (5 min) Topics and dates. Ask each group to agree on a topic their timeline will explore. " +
                  		"Ask each group to choose starting and ending dates for their timeline " +
                  		"and mark these dates with sticky notes. " +
                  		"3. (10 min) Start and end. Ask each group to choose at least three stories that describe the end of the timeline. They should " +
                  		"write the title of each story on a sticky note, and build a cluster of these notes at the end of the timeline. " +
                  		"They should do the same for the timeline start." +
                  		"4. (25 min) Filling in. Have each group work backwards through time, adding stories (from those they have been given) to the timeline along the way. " +
                  		"5. (5 min) Turning points. Ask groups to mark turning points, or times when things changed in significant ways, on their timeline. " +
                  		"6. (10 min). Review. Ask each group to review their timeline, looking for interesting or useful features. " +
                  		"7. (10 min). Visiting. Ask everyone to walk around the room looking over all of the timelines created. " +
                  		"8. (10 min). Finishing. Ask each group to finish their timeline, taking into consideration things visitors said about it. " +
                  		"9. (10 min). Discussion. Bring everyone together into a discussion of all the timelines.",
                  "optionalParts": "Use whole stories instead of story titles; use vertical space to annotate stories; " +
                  		"distinuguish multiple perspectives; mark multiple types of turning point; etc. (See WWS for details.)",
                  "duration": "90 minutes",
	              "recording": "None required",
                  "materials": "Sticky notes",
	              "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                        "listening to recordings don't overlap); spaces to work on (tables, walls, floor)",
                  "facilitation": "Watch out for people paying more attention to when things happened than to " +
                  		"what that might mean. Especially when they are finding turning points and looking for larger " +
                  		"patterns, eople should be negotiating meaning, " +
                  		"not just mapping events."
               },
               {
            	   "id": "timelineShort",
                   "shortName": "Timeline (short version)",
                   "type": "timeline exercise",
                   "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
                   		"groups of three or four people each. " +
                   		"2. (5 min) Topics and dates. Ask each group to agree on a topic their timeline will explore. " +
                   		"Ask each group to choose starting and ending dates for their timeline " +
                   		"and mark these dates with sticky notes. " +
                   		"3. (5 min) Start and end. Ask each group to choose at least three stories that describe the end of the timeline. They should " +
                   		"write the title of each story on a sticky note, and build a cluster of these notes at the end of the timeline. " +
                   		"They should do the same for the timeline start." +
                   		"4. (20 min) Filling in. Have each group work backwards through time, adding stories (from those they have been given) to the timeline along the way. " +
                   		"5. (5 min) Turning points. Ask groups to mark turning points, or times when things changed in significant ways, on their timeline. " +
                    	"5. (10 min). Visiting. Ask everyone to walk around the room looking over all of the timelines created. ",
                    "optionalParts": "None",
                   "duration": "45 minutes",
 	              "recording": "None required",
                  "materials": "Sticky notes",
 	              "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                         "listening to recordings don't overlap); spaces to work on (tables, walls, floor)",
                   "facilitation": "Watch out for people paying more attention to when things happened than to " +
                   		"what that might mean. Especially when they are finding turning points and looking for larger " +
                   		"patterns, eople should be negotiating meaning, " +
                   		"not just mapping events."
                },
                {
                	"id": "landscape",
                    "shortName": "Landscape",
                    "type": "landscape exercise",
                    "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
              		"groups of three or four people each. " +
              		"2. (5 min) Dimensions and corners. Ask each group to mark each axis of the space using dimensions you have chosen. " +
              		"Ask people to label each corner point with descriptions of how the two dimensions come together " +
              		"at that corner." +
              		"3. (40 min) Filling in. Having defined their space, each group will now fill it up with the stories they were given. " +
              		"4. (25 min) Features. After groups have populated their spaces, ask them to mark out features of the landscape. " +
              		"5. (15 min) Review. Ask each group to work together on the story their landscape tells and what discoveries they find in it. " +
              		"6. (10 min) Visiting. Ask everyone to walk around the room looking over all of the landscapes created and " +
              		"talking about the experiences described there. " +
              		"7. (10 min) Finishing. Groups should add a legend explaining all annotations to their landscape as well as a summary of its major features. " +
              		"8. (10 min). Discussion. Bring everyone together into a discussion of all the landscapes.",
                    "optionalParts": "Consider a third dimension; consider multiple perspectives; " +
                    		"ask people to create their own dimensions (see WWS for details).",
                    "duration": "two hours",
   	                "recording": "None required",
                    "materials": "Sticky notes",
   	                "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                           "listening to recordings don't overlap); spaces to work on (tables, walls, floor)",
                    "facilitation": "Watch out for categorization; too-precise or too-sloppy placement; " +
                    		"hesitation; dimensions that don't fit the stories (have extras on hand)."
                },
                {
                	"id": "landscapeShort",
                    "shortName": "Landscape (short version)", 
                    "type": "landscape exercise (short version)",
                    "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
              		"groups of three or four people each. " +
              		"2. (5 min) Dimensions and corners. Ask each group to mark each axis of the space using dimensions you have chosen. " +
              		"Ask people to label each corner point with descriptions of how the two dimensions come together " +
              		"at that corner." +
              		"3. (20 min) Filling in. Having defined their space, each group will now fill it up with the stories they were given. " +
              		"4. (10 min) Features. After groups have populated their spaces, ask them to mark out features of the landscape. " +
              		"5. (5 min) Visiting. Ask everyone to walk around the room looking over all of the landscapes created and " +
              		"talking about the experiences described there. ",
                    "optionalParts": "None",
                    "duration": "45 minutes",
   	                "recording": "None required",
                    "materials": "Sticky notes",
   	                "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
                           "listening to recordings don't overlap); spaces to work on (tables, walls, floor)",
                    "facilitation": "Watch out for categorization; too-precise or too-sloppy placement; " +
                    		"hesitation; dimensions that don't fit the stories (have extras on hand)."
                },
              {
                  "id": "storyElements",
                  "shortName": "Story elements",
                  "type": "story elements exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Explain the question " +
                  		"people will be asking about stories (like 'What is going on in this story?'). Split into small " +
              		"groups of three or four people each. " +
              		"2. (20 min) Filling in. Each group should consider the stories they were given and " +
              		"answer the question (you told them about in the introduction) about it a few times. " +
              		"They should write the answers on sticky notes." +
              		"3. (15 min) Clustering. Ask each group to put away the stories and consider only the answers. " +
              		"On a large blank space, groups should place similar items together, like with like, until " +
              		"groups form. " +
              		"4. (10 min) Describing clusters. Groups should list two to four good and bad attributes " +
              		"about each cluster. " +
              		"5. (10 min) Second clustering. Ask groups to cluster the attributes (all of them together, " +
              		"regardless of which cluster they came from) in exactly the same way in which they clustered " +
              		"the original answers. " +
              		"6. (10 min) Review. Ask each group to talk together about what they have discovered. " +
              		"7. (5 min) Visiting. Ask everyone to walk around the room looking over all of the story elements that have been created. " +
              		"8. (5 min) Finishing. Groups should create a summary that describes, in their own words, what each story element means " +
              		"to them and what they have learned from it. " +
              		"9. (10 min) Discussion. Bring everyone together into a discussion of all the story elements.",
                  "optionalParts": "xxx",
                  "duration": "90 minutes",
 	              "recording": "None required",
                  "materials": "Sticky notes",
	               "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
	                	"listening to recordings don't overlap); spaces to work on (tables, walls, floor)",
                   "facilitation": "Watch out for categorization (remind people that clustering is open-ended); " +
                   		"weak response; bad story element names (e.g., proper nouns)."
              },
              {
            	  "id": "storyElementsShort",
                  "shortName": "Story elements (short version)",
                  "type": "story elements exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Explain the question " +
                  		"people will be asking about stories (like 'What is going on in this story?'). Split into small " +
              		"groups of three or four people each. " +
              		"2. (20 min) Filling in. Each group should consider the stories they were given and " +
              		"answer the question (you told them about in the introduction) about it a few times. " +
              		"They should write the answers on sticky notes." +
              		"3. (15 min) Clustering. Ask each group to put away the stories and consider only the answers. " +
              		"On a large blank space, groups should place similar items together, like with like, until " +
              		"groups form. " +
              		"4. (10 min) Describing clusters. Groups should list two to four good and bad attributes " +
              		"about each cluster. " +
              		"5. (5 min) Second clustering. Ask groups to cluster the attributes (all of them together, " +
              		"regardless of which cluster they came from) in exactly the same way in which they clustered " +
              		"the original answers. " +
              		"to them and what they have learned from it. " +
              		"6. (5 min) Discussion. Bring everyone together into a discussion of all the story elements.",
                  "optionalParts": "Use more than one element type; create association trails; find exemplar stories; " +
                  		"compare story elements to published models (see WWS for details).",
                  "duration": "one hour",
                  "recording": "None required",
                  "materials": "Sticky notes",
 	               "spaces": "Places for people to sit in small groups (with enough space between so conversations and/or " +
 	                	"listening to recordings don't overlap); spaces to work on (tables, walls, floor)",
                    "facilitation": "Watch out for categorization (remind people that clustering is open-ended); " +
                    		"weak response; bad story element names (e.g., proper nouns)."
              },
              {
            	  "id": "compositeStories",
                  "shortName": "Composite stories",
                  "type": "composite stories exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
              			"groups of three or four people each. Make sure you have at least three groups in total. " +
              			"2. (5 min) Choosing a message. Each group should agree on a message they want their constructed story to deliver. " +
              			"3. (20 min) Filling in the template. Introduce a story template. Groups should place stories into spaces on the " +
              			"template where they seem to fit and support the overall message. " +
              			"4. (20 min) Forming the story. In this step the focus of each group should move from assembling " +
              			"stories to creating one new fictional story inspired by the assembled stories. " +
              			"5. (10 min) First telling. Now each storyteller should visit another group, tell their group’s story, " +
              			"and listen to feedback. " +
              			"6. (15 min) Preparation for second telling. Storytellers should report on how the storytelling went, " +
              			"then the group should go back and improve on their story in preparation for a second telling. " +
              			"7. (10 min) Second telling. Now the same storytellers should proceed to another group " +
              			"(not the one they told the story to the first time) and tell the story again. Again they " +
              			"should gather feedback. " +
              			"8. (15 min) Finishing. Again the groups should improve their stories. If desired, " +
              			"they should record the story now. " +
              			"9. (10 min) Group discussion. Now that each story has been told, retold, and possibly recorded, " +
              			"it is time for groups to discuss what they have learned by building the story. " +
              			"10. (10 min) Discussion. Now bring everyone in the room into one large discussion about all the stories and the entire process.",
                  "optionalParts": "Add more up-front story choices (topic, genre, subtext, etc); " +
                  		"tell the story three times; use repetition and recursion to make the story more complex; " +
                  		"have two people play out the story; etc. (See WWS for details.)",
                  "duration": "two hours",
                  "recording": "None required",
                  "materials": "Sticky notes",
                  "spaces": "None required, though people might like to place their sticky notes onto a space to prepare their story",
                  "facilitation": "Watch out for people not understanding the template (have others on hand); " +
                  		"people not liking the idea of making things up; people going through the process " +
                  		"mechanically; people paying too much attention to story quality."
              },
              {
            	  "id": "compositeStoriesShort",
                  "shortName": "Composite stories (short version)",
                  "type": "composite stories exercise",
                  "plan": "1. (5 min) Introduction. Explain the exercise and its purpose. Split into small " +
              			"groups of three or four people each. Make sure you have at least three groups in total. " +
              			"Also, each group should agree on a message they want their constructed story to deliver. " +
              			"2. (20 min) Filling in the template. Introduce a story template. Groups should place stories into spaces on the " +
              			"template where they seem to fit and support the overall message. " +
              			"3 (20 min) Forming the story. In this step the focus of each group should move from assembling " +
              			"stories to creating one new fictional story inspired by the assembled stories. " +
              			"4. (5 min) First telling. Now each storyteller should visit another group, tell their group’s story, " +
              			"and listen to feedback. " +
              			"5. (10 min) Preparation for second telling. Storytellers should report on how the storytelling went, " +
              			"then the group should go back and improve on their story in preparation for a second telling. " +
              			"6. (5 min) Second telling. Now the same storytellers should proceed to another group " +
              			"(not the one they told the story to the first time) and tell the story again. Again they " +
              			"should gather feedback. " +
              			"7. (10 min) Finishing. Again the groups should improve their stories. If desired, " +
              			"they should record the story now. " +
              			"8. (5 min) Group discussion. Now that each story has been told, retold, and possibly recorded, " +
              			"it is time for groups to discuss what they have learned by building the story. " +
              			"9. (10 min) Discussion. Now bring everyone in the room into one large discussion about all the stories and the entire process.",
                  "optionalParts": "None",
                  "duration": "90 minutes",
                  "recording": "None required",
                  "materials": "Sticky notes",
                  "spaces": "None required, though people might like to place their sticky notes onto a space to prepare their story",
                  "facilitation": "Watch out for people not understanding the template (have others on hand); " +
                  		"people not liking the idea of making things up; people going through the process " +
                  		"mechanically; people paying too much attention to story quality."
              }
	    ]
    }
];
  
function convertSemicolonsToNewlinesForOptions(section) {
    const questions = section.questions;
    for (let questionIndex in questions) {
        const question = questions[questionIndex];
        if (question.options) {
            question.options = question.options.replace(/;/g, "\n");
        }
    }
    return section;
}

export const elicitationQuestions = convertSemicolonsToNewlinesForOptions(templates[0]);
export const storyQuestions = convertSemicolonsToNewlinesForOptions(templates[1]);
export const participantQuestions = convertSemicolonsToNewlinesForOptions(templates[2]);
export const annotationQuestions = convertSemicolonsToNewlinesForOptions(templates[3]);
export const storyCollectionActivities = convertSemicolonsToNewlinesForOptions(templates[4]);
export const sensemakingActivities = convertSemicolonsToNewlinesForOptions(templates[5]);

