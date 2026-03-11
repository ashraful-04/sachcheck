AI-Based Fake News Detection System for Indian Social Media Content

1. Introduction
The rapid spread of misinformation on social media platforms such as WhatsApp, Facebook, and Twitter has become a major challenge in India. Fake news often spreads faster than verified information and can influence public opinion, create panic, or manipulate narratives.
This project proposes the development of an AI-based fake news detection system that analyzes user-submitted text and determines whether the news is likely to be real or fake. The system combines news verification through trusted journalism sources and machine learning classification to provide reliable results along with explanations.

2. Objectives
• Detect whether a given news headline or text is fake or real.
• Verify whether the news is reported by credible journalism sources.
• Provide a confidence score indicating the likelihood of the news being true.
• Explain why the system classified the news in a particular way.
• Provide additional features such as top news feeds, news search, and source credibility checks.

3. System Overview
The proposed system uses a two-stage verification process.

Stage 1: News Verification using NewsAPI
The system first checks whether the news appears in trusted journalism sources using NewsAPI.
If related articles are found, the system marks the news as Real and displays the verified sources.
Example:
User Input: India launches new satellite for climate monitoring
System Response: Status: Real | Sources: BBC News, Reuters, The Hindu

Stage 2: Machine Learning Classification
If the news is not found through NewsAPI, the system sends the input text to a Logistic Regression model trained on the BharatFakeNewsKosh dataset.
The model classifies the text into: Fake, Likely Fake, Uncertain, Likely Real, or Real.
The classification is based on the sigmoid probability score produced by the model.
Example:
User Input: Government secretly installing surveillance chips in new Aadhaar cards
System Response: Prediction: Likely Fake | Confidence Score: 0.82

4. Reasoning / Explainability
The system will provide explanations for its predictions by highlighting influential keywords detected by the model.
Example:
Reasoning: Keywords influencing classification – secretly, surveillance chips, government hiding.

5. Dataset
IFND - Indian Fake News Dataset
This dataset contains examples of fake and real news relevant to Indian social media content.

6. Additional Features
Top News Dashboard – Displays trending news from Indian and global sources using NewsAPI.
News Search – Allows users to search for topics and view related articles from verified news outlets.
Source Credibility Checker – Checks whether a news domain is trusted or suspicious using a JSON whitelist and blacklist.

7. Technology Stack
Backend: Python, Scikit-learn, TF-IDF Vectorization, NewsAPI
Machine Learning: Logistic Regression classifier with sigmoid probability scoring
Dataset: BharatFakeNewsKosh
Frontend: Web interface for user input and result display

8. Expected Outcome
The system will allow users to input a news headline or social media message and receive a prediction indicating whether the news is fake or real. It will also provide a confidence score, reasoning behind the decision, and links to verified news sources when available.

9. Example Workflow
Example 1:
Input: ISRO launches Chandrayaan-4 mission
Output: Real | Verified sources: Reuters, BBC, The Hindu

Example 2:
Input: NASA confirms aliens discovered in Himalayan cave
Output: Fake | Confidence: 0.91 | Reason: sensational claim and lack of credible sources

10. Conclusion
This project proposes a practical AI-assisted fake news detection system designed specifically for Indian social media content. By combining journalism source verification and machine learning classification, the system aims to provide reliable news validation along with interpretable explanations and useful news-related features.