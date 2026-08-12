import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class Hospital(Base):
    __tablename__ = "hospitals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Apollo Emergency & Specialty Hospital")
    code = Column(String, default="APOLLO-BLR-01")
    total_floors = Column(Integer, default=4)
    safety_status = Column(String, default="SAFE") # SAFE, WARNING, CRITICAL
    safety_score = Column(Float, default=98.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Floor(Base):
    __tablename__ = "floors"
    
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    floor_number = Column(Integer, index=True)
    name = Column(String) # e.g. Floor 2 - ICU & Cardiac Wing
    blueprint_svg = Column(Text, nullable=True)
    risk_level = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Float, default=12.0)
    people_count = Column(Integer, default=24)
    
    cameras = relationship("Camera", back_populates="floor")
    sensors = relationship("Sensor", back_populates="floor")
    equipment = relationship("FireEquipment", back_populates="floor")
    exits = relationship("EmergencyExit", back_populates="floor")

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"))
    name = Column(String)
    code = Column(String)
    room_type = Column(String) # ICU, WARD, STORAGE, ELECTRICAL, CORRIDOR, OXYGEN
    sensitivity_level = Column(String, default="NORMAL") # HIGH, CRITICAL, NORMAL

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"))
    code = Column(String, unique=True, index=True)
    name = Column(String)
    location = Column(String)
    x_position = Column(Float, default=50.0) # percentage for blueprint positioning
    y_position = Column(Float, default=50.0)
    status = Column(String, default="ONLINE") # ONLINE, OFFLINE, MAINTENANCE
    stream_url = Column(String, nullable=True)
    last_detection = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)
    
    floor = relationship("Floor", back_populates="cameras")

class Sensor(Base):
    __tablename__ = "sensors"
    
    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"))
    code = Column(String, unique=True, index=True)
    sensor_type = Column(String) # SMOKE, FLAME, TEMPERATURE, OXYGEN
    location = Column(String)
    x_position = Column(Float, default=50.0)
    y_position = Column(Float, default=50.0)
    value = Column(Float, default=24.0) # Temp in C, Smoke level %, Flame true/false
    status = Column(String, default="NORMAL") # NORMAL, WARNING, ALARM
    
    floor = relationship("Floor", back_populates="sensors")

class FireEquipment(Base):
    __tablename__ = "equipment"
    
    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"))
    passport_id = Column(String, unique=True, index=True) # e.g. EXT-204
    equipment_type = Column(String) # CO2 Extinguisher, Water Hose, Fire Door, Smoke Mask Box
    location = Column(String)
    x_position = Column(Float, default=50.0)
    y_position = Column(Float, default=50.0)
    last_inspected = Column(String, default="2026-07-15")
    next_inspection = Column(String, default="2026-09-15")
    status = Column(String, default="AVAILABLE") # AVAILABLE, BLOCKED, MISSING, EXPIRED
    qr_code = Column(String)
    
    floor = relationship("Floor", back_populates="equipment")

class EmergencyExit(Base):
    __tablename__ = "exits"
    
    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"))
    code = Column(String, unique=True, index=True) # EXIT-01-EAST
    name = Column(String)
    location = Column(String)
    x_position = Column(Float, default=50.0)
    y_position = Column(Float, default=50.0)
    is_accessible = Column(Boolean, default=True)
    status = Column(String, default="SAFE") # SAFE, BLOCKED, HAZARD
    distance_meters = Column(Float, default=45.0)
    
    floor = relationship("Floor", back_populates="exits")

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_number = Column(String, unique=True, index=True) # INC-2026-0811-01
    title = Column(String)
    floor_id = Column(Integer, ForeignKey("floors.id"))
    location = Column(String)
    severity = Column(String) # WARNING, HIGH, CRITICAL
    confidence = Column(Float, default=0.94)
    risk_score = Column(Float, default=94.0)
    status = Column(String, default="ACTIVE") # ACTIVE, RESOLVED, INVESTIGATING
    rationale = Column(Text)
    people_nearby = Column(Integer, default=17)
    safest_exit = Column(String, default="EAST EMERGENCY EXIT")
    blocked_exit = Column(String, default="NORTH ICU EXIT")
    is_simulation = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Evidence(Base):
    __tablename__ = "evidence"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    camera_code = Column(String)
    media_type = Column(String, default="IMAGE") # IMAGE, VIDEO, SENSOR_LOG
    file_path = Column(String)
    ai_annotations = Column(JSON) # bounding boxes, probabilities
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class ComplianceViolation(Base):
    __tablename__ = "compliance_violations"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    location = Column(String)
    floor_number = Column(Integer)
    equipment_type = Column(String)
    duration_minutes = Column(Integer, default=15)
    recurrence_count = Column(Integer, default=1)
    status = Column(String, default="OPEN") # OPEN, NOTIFIED, RESOLVED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
