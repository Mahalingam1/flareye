class Settings:
    PROJECT_NAME: str = "FLAREYE"
    PROJECT_TAGLINE: str = "SEE. UNDERSTAND. PREDICT. PROTECT."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # DB
    DATABASE_URL: str = "sqlite+aiosqlite:///./flareye.db"
    
    # AI Thresholds
    FIRE_CONFIDENCE_THRESHOLD: float = 0.85
    SMOKE_CONFIDENCE_THRESHOLD: float = 0.80
    TEMP_WARNING_CELSIUS: float = 45.0
    TEMP_CRITICAL_CELSIUS: float = 65.0
    
    # System
    FRAME_SKIP: int = 2
    WS_HEARTBEAT_INTERVAL: float = 1.0

settings = Settings()
