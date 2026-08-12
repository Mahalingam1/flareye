from typing import Dict, Any, Optional

class CopilotEngine:
    """
    AI Safety Copilot & Voice Assistance Engine.
    Handles natural language queries and translates technical outputs into 
    simple, reassuring plain language for elderly administrators.
    Supports English, Tamil, and Hindi.
    """
    def answer_query(self, query: str, language: str = "English", is_emergency: bool = False) -> Dict[str, Any]:
        q = query.lower()
        lang = language.capitalize()
        
        # English Responses
        if "safe" in q or "status" in q:
            if is_emergency:
                en = "A fire emergency has been detected on Floor 2. Please follow safe evacuation guidance immediately."
                ta = "இரண்டாம் தளத்தில் தீ விபத்து கண்டறியப்பட்டுள்ளது. உடனடியாக பாதுகாப்பான வெளியேற்ற வழிமுறைகளைப் பின்பற்றவும்."
                hi = "द्वितीय तल पर आग की आपातकालीन स्थिति का पता चला है। कृपया तुरंत सुरक्षित निकासी निर्देशों का पालन करें।"
                action = "SHOW_EMERGENCY"
            else:
                en = "The hospital is currently SAFE. All 47 cameras and 84 IoT sensors are operating normally."
                ta = "மருத்துவமனை தற்போது பாதுகாப்பாக உள்ளது. அனைத்து கேமராக்களும் சென்சார்களும் இயல்பாக செயல்படுகின்றன."
                hi = "अस्पताल वर्तमान में सुरक्षित है। सभी कैमरे और सेंसर सामान्य रूप से काम कर रहे हैं।"
                action = "SHOW_NORMAL"
                
        elif "fire" in q or "where" in q or "location" in q:
            en = "Fire and smoke are detected on Floor 2 in the ICU Corridor near Room 204. The temperature is 68°C."
            ta = "இரண்டாம் தளத்தில் உள்ள ஐசியூ மண்டபத்தில் அறை 204 அருகில் தீ மற்றும் புகை கண்டறியப்பட்டுள்ளது."
            hi = "द्वितीय तल पर आईसीयू कॉरिडोर में कमरा 204 के पास आग और धुआं देखा गया है।"
            action = "ZOOM_FLOOR_2"
            
        elif "exit" in q or "route" in q or "evacuat" in q:
            en = "The North ICU Exit is BLOCKED by smoke. The EAST EMERGENCY RAMP EXIT is SAFE and clear. Distance is 84 meters."
            ta = "வடக்கு ஐசியூ வெளியேறும் வழி புகையால் தடுக்கப்பட்டுள்ளது. கிழக்கு அவசர வழி பாதுகாப்பாக உள்ளது."
            hi = "उत्तर आईसीयू निकास धुएं से अवरुद्ध है। पूर्व आपातकालीन निकास सुरक्षित और साफ है।"
            action = "SHOW_EVACUATION_ROUTE"
            
        elif "report" in q or "summary" in q:
            en = "Generating today's Hospital Fire Safety Compliance & Risk Report. Download link is ready."
            ta = "இன்றைய மருத்துவமனை தீ பாதுகாப்பு அறிக்கை உருவாக்கப்படுகிறது."
            hi = "आज की अस्पताल अग्नि सुरक्षा रिपोर्ट तैयार की जा रही है।"
            action = "GENERATE_REPORT"
            
        elif "violation" in q or "compliance" in q or "problem" in q:
            en = "There are 2 active compliance warnings: North Exit corridor blocked by trolley (18 mins) and 1 expired extinguisher in Floor 3."
            ta = "2 பாதுகாப்பு எச்சரிக்கைகள் உள்ளன: வடக்கு வழி தள்ளுவண்டியால் அடைக்கப்பட்டுள்ளது."
            hi = "2 सक्रिय अनुपालन चेतावनियां हैं: उत्तर कॉरिडोर में ट्रॉली से रुकावट है।"
            action = "SHOW_COMPLIANCE"
            
        else:
            en = f"FLAREYE AI Assistant active. All hospital zones are monitored. You asked: '{query}'. Hospital overall risk score is normal."
            ta = f"ஃபிளேர்-ஐ உதவி மையம் தயார் நிலையில் உள்ளது. நீங்கள் கேட்டது: '{query}'."
            hi = f"फ्लेयर-आई सहायता सक्रिय है। आपने पूछा: '{query}'."
            action = "DEFAULT"

        # Select language output text
        if lang == "Tamil":
            answer_text = ta
        elif lang == "Hindi":
            answer_text = hi
        else:
            answer_text = en

        return {
            "answer": answer_text,
            "voice_audio_text": answer_text,
            "highlight_action": action,
            "related_exit": "EAST EMERGENCY EXIT",
            "language": lang
        }

copilot_engine = CopilotEngine()
