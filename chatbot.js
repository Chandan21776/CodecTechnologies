/**
 * Customer Service Chatbot
 * A rule-based chatbot with basic NLP capabilities for handling customer queries
 */

// Main Chatbot Class
class CustomerServiceChatbot {
    constructor() {
        // Initialize knowledge base with common customer queries and responses
        this.knowledgeBase = {
            "greeting": [
                "Hello! Welcome to our customer service. How can I help you today?",
                "Hi there! I'm your virtual assistant. What can I do for you?",
                "Welcome! I'm here to assist you with any questions or concerns."
            ],
            "goodbye": [
                "Thank you for chatting with us. Have a great day!",
                "Is there anything else I can help you with? If not, have a wonderful day!",
                "Thanks for reaching out. Feel free to contact us again if you need further assistance."
            ],
            "hours": [
                "Our business hours are Monday to Friday, 9 AM to 6 PM, and Saturday 10 AM to 4 PM. We're closed on Sundays.",
                "We're open weekdays 9-6 and Saturdays 10-4. Closed on Sundays."
            ],
            "returns": [
                "You can return items within 30 days of purchase with the original receipt. Please visit our returns page for more details.",
                "Our return policy allows returns within 30 days. Make sure you have your receipt or order number ready."
            ],
            "shipping": [
                "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days at an additional cost.",
                "We offer standard (3-5 days) and express (1-2 days) shipping options."
            ],
            "payment": [
                "We accept all major credit cards, PayPal, and Apple Pay as payment methods.",
                "You can pay using credit cards, PayPal, or Apple Pay on our platform."
            ],
            "contact": [
                "You can reach our customer service team at support@example.com or call us at 1-800-123-4567.",
                "Our support email is support@example.com, and our phone line is 1-800-123-4567."
            ],
            "product_info": [
                "For detailed product information, please provide the specific product name or ID, and I can help you with that.",
                "I'd be happy to provide product details. Could you specify which product you're interested in?"
            ],
            "discount": [
                "We regularly offer seasonal discounts and promotions. Sign up for our newsletter to stay updated on the latest deals.",
                "You can use code WELCOME10 for 10% off your first purchase. We also have seasonal promotions throughout the year."
            ],
            "account": [
                "To manage your account, please log in on our website and navigate to 'My Account' section.",
                "Account settings can be accessed from the 'My Account' page after logging in."
            ],
            "complaint": [
                "I'm sorry to hear you're experiencing issues. Could you provide more details so we can address your concerns properly?",
                "I apologize for any inconvenience. Please share more information about your issue, and I'll do my best to help resolve it."
            ],
            "fallback": [
                "I'm not sure I understand your question. Could you please rephrase it?",
                "I don't have information on that topic yet. Would you like me to connect you with a human representative?",
                "I'm still learning! Could you try asking your question differently or choose from our common topics?"
            ]
        };

        // Define patterns for matching user queries using regular expressions
        this.patterns = {
            "greeting": /\b(hello|hi|hey|greetings|howdy|good morning|good afternoon|good evening|hi there)\b/i,
            "goodbye": /\b(bye|goodbye|see you|farewell|end|quit|exit)\b/i,
            "hours": /\b(hours|time|schedule|open|closed|operation|business hours)\b/i,
            "returns": /\b(return|refund|exchange|send back|policy)\b/i,
            "shipping": /\b(shipping|delivery|ship|deliver|arrival|tracking)\b/i,
            "payment": /\b(payment|pay|credit|debit|card|paypal|apple pay|method)\b/i,
            "contact": /\b(contact|email|phone|call|reach|support)\b/i,
            "product_info": /\b(product|item|details|specifications|specs|info|information|features)\b/i,
            "discount": /\b(discount|offer|promo|promotion|coupon|code|sale|deal)\b/i,
            "account": /\b(account|profile|login|sign in|password|username|register)\b/i,
            "complaint": /\b(complaint|problem|issue|wrong|broken|damaged|dissatisfied|not working|unhappy)\b/i
        };

        // Chat history
        this.chatHistory = [];

        // Context tracking for handling follow-up questions
        this.currentContext = null;

        // Quick reply suggestions based on context
        this.quickReplies = {
            "greeting": ["Business hours", "Return policy", "Shipping info"],
            "returns": ["How to return", "Return timeframe", "Refund process"],
            "shipping": ["Shipping cost", "Delivery time", "Track my order"],
            "product_info": ["Product price", "Product availability", "Product features"],
            "complaint": ["Speak to representative", "Submit complaint", "Request callback"]
        };
    }

    // Process user input and generate response
    processInput(userInput) {
        // Add user message to chat history
        this.chatHistory.push({ role: "user", message: userInput });

        // Clean and normalize input
        const cleanedInput = userInput.toLowerCase().trim();

        // Check for context-based follow-up questions
        if (this.currentContext) {
            const contextResponse = this.handleContextualQuery(cleanedInput);
            if (contextResponse) {
                return this.finalizeResponse(contextResponse);
            }
        }

        // Check for negative sentiment
        const sentimentResponse = this.handleNegativeSentiment(cleanedInput);
        if (sentimentResponse) {
            return this.finalizeResponse(sentimentResponse);
        }

        // Find matching intent based on patterns
        let intent = this.findIntent(cleanedInput);

        // Set current context based on intent
        if (intent !== "fallback") {
            this.currentContext = intent;
        }

        // Get response based on intent
        const response = this.getResponse(intent);

        return this.finalizeResponse(response);
    }

    // Find the intent based on user input and patterns
    findIntent(input) {
        for (const [intent, pattern] of Object.entries(this.patterns)) {
            if (pattern.test(input)) {
                return intent;
            }
        }
        return "fallback";
    }

    // Get a response based on the identified intent
    getResponse(intent) {
        const responses = this.knowledgeBase[intent];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Handle follow-up questions based on context
    handleContextualQuery(input) {
        // Product context follow-ups
        if (this.currentContext === "product_info") {
            if (/\b(price|cost|how much)\b/i.test(input)) {
                return "Product prices vary depending on the model and features. Could you specify which product you're interested in?";
            }
            if (/\b(available|stock|in stock)\b/i.test(input)) {
                return "To check product availability, please provide the specific product name or visit our website's inventory section.";
            }
            if (/\b(feature|specification|detail|what can it do)\b/i.test(input)) {
                return "Our products come with various features depending on the model. Could you specify which product you're asking about?";
            }
        }

        // Shipping context follow-ups
        if (this.currentContext === "shipping") {
            if (/\b(track|where|status|when|arrive)\b/i.test(input)) {
                return "To track your order, please enter your order number or log into your account to view shipping status.";
            }
            if (/\b(cost|price|fee|how much)\b/i.test(input)) {
                return "Shipping costs depend on your location and the chosen shipping method. Standard shipping starts at $5.99, while express shipping starts at $12.99.";
            }
            if (/\b(international|abroad|overseas|country)\b/i.test(input)) {
                return "Yes, we ship internationally to over 50 countries. International shipping typically takes 7-14 business days depending on the destination.";
            }
        }

        // Returns context follow-ups
        if (this.currentContext === "returns") {
            if (/\b(how|process|steps|where)\b/i.test(input)) {
                return "To process a return, log into your account, select the order, and click on 'Return Items'. You'll receive a prepaid shipping label to send the item back.";
            }
            if (/\b(money back|refund|reimburse)\b/i.test(input)) {
                return "Refunds are processed within 3-5 business days after we receive the returned item. The amount will be credited back to your original payment method.";
            }
            if (/\b(damaged|broken|not working)\b/i.test(input)) {
                return "For damaged items, please take a photo of the damage and contact our support team. We'll arrange a replacement or refund without requiring you to return the item.";
            }
        }

        // No contextual response found
        return null;
    }

    // Finalize response and add to chat history
    finalizeResponse(response) {
        this.chatHistory.push({ role: "bot", message: response });
        return {
            message: response,
            context: this.currentContext,
            suggestedReplies: this.getQuickReplies()
        };
    }

    // Get quick replies based on current context
    getQuickReplies() {
        if (this.currentContext && this.quickReplies[this.currentContext]) {
            return this.quickReplies[this.currentContext];
        }
        return [];
    }

    // Get the full chat history
    getChatHistory() {
        return this.chatHistory;
    }

    // Reset the chatbot context
    resetContext() {
        this.currentContext = null;
        return "Context has been reset. How else can I help you?";
    }

    // Basic sentiment analysis to detect user frustration
    detectSentiment(input) {
        const negativeTerms = ["angry", "frustrated", "useless", "stupid", "waste", "terrible", "awful", "horrible", "worst", "mad", "ridiculous"];
        let negativeCount = 0;

        negativeTerms.forEach(term => {
            if (input.toLowerCase().includes(term)) {
                negativeCount++;
            }
        });

        if (negativeCount >= 2) {
            return "negative";
        } else if (input.includes("!")) {
            return "potentially negative";
        }
        return "neutral";
    }

    // Handle user frustration
    handleNegativeSentiment(input) {
        const sentiment = this.detectSentiment(input);

        if (sentiment === "negative") {
            this.currentContext = "complaint";
            return "I notice you seem frustrated. I'd like to help resolve your issue. Would you prefer to speak with a human representative?";
        } else if (sentiment === "potentially negative") {
            return "I understand this may be frustrating. Let me try to help you more effectively. Could you provide more details?";
        }

        return null;
    }
}

// Initialize the chatbot and UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new CustomerServiceChatbot();
    const messagesContainer = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Function to display a message in the chat interface
    function displayMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = isUser ? 'message user-message' : 'message bot-message';

        // Create message content
        messageElement.textContent = message;

        // Add time
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        const now = new Date();
        timeElement.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        messageElement.appendChild(timeElement);

        // Add to messages container
        messagesContainer.appendChild(messageElement);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to display quick reply buttons
    function displayQuickReplies(replies) {
        if (!replies || replies.length === 0) return;

        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';

        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.addEventListener('click', () => {
                userInput.value = reply;
                sendMessage();
            });
            quickRepliesContainer.appendChild(button);
        });

        messagesContainer.appendChild(quickRepliesContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        indicator.id = 'typing-indicator';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Function to handle sending a message
    function sendMessage() {
        const message = userInput.value.trim();

        if (message) {
            // Display user message
            displayMessage(message, true);

            // Clear input
            userInput.value = '';

            // Show typing indicator
            showTypingIndicator();

            // Process with chatbot (with artificial delay for realism)
            setTimeout(() => {
                removeTypingIndicator();

                const response = chatbot.processInput(message);
                displayMessage(response.message);

                if (response.suggestedReplies.length > 0) {
                    displayQuickReplies(response.suggestedReplies);
                }
            }, Math.random() * 1000 + 500); // Random delay between 500ms and 1500ms
        }
    }

    // Send button event listener
    sendButton.addEventListener('click', sendMessage);

    // Input keypress event listener (for Enter key)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Send initial greeting
    setTimeout(() => {
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const greeting = chatbot.getResponse("greeting");
            displayMessage(greeting);
            displayQuickReplies(chatbot.quickReplies["greeting"]);
        }, 1000);
    }, 500);
});