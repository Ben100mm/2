from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON, Boolean, Float, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class SavedDeal(Base):
    __tablename__ = "saved_deals"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Deal information
    deal_name = Column(String, nullable=False)
    property_address = Column(String, nullable=False)
    property_type = Column(String, nullable=False)
    operation_type = Column(String, nullable=False)
    
    # Deal data (full DealState object)
    deal_data = Column(JSON, nullable=False)
    analysis_results = Column(JSON, nullable=True)
    
    # Metadata
    tags = Column(JSON, nullable=True)
    is_favorite = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="deals")

class PropertyAnalysis(Base):
    __tablename__ = "property_analyses"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Analysis information
    property_id = Column(String, nullable=False)
    analysis_type = Column(String, nullable=False)  # underwrite, market_analysis, rental_analysis
    analysis_data = Column(JSON, nullable=False)
    results = Column(JSON, nullable=True)
    
    # Metadata
    property_address = Column(String, nullable=True)
    analysis_name = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="property_analyses")
