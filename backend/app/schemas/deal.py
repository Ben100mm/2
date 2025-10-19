from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class DealCreate(BaseModel):
    deal_name: str
    property_address: str
    property_type: str
    operation_type: str
    deal_data: Dict[str, Any]
    tags: Optional[List[str]] = None

class DealUpdate(BaseModel):
    deal_name: Optional[str] = None
    property_address: Optional[str] = None
    deal_data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    is_favorite: Optional[bool] = None
    is_archived: Optional[bool] = None

class DealResponse(BaseModel):
    id: str
    deal_name: str
    property_address: str
    property_type: str
    operation_type: str
    tags: Optional[List[str]]
    is_favorite: bool
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PropertyAnalysisCreate(BaseModel):
    property_id: str
    analysis_type: str
    analysis_data: Dict[str, Any]
    property_address: Optional[str] = None
    analysis_name: Optional[str] = None
    is_public: bool = False

class PropertyAnalysisResponse(BaseModel):
    id: str
    property_id: str
    analysis_type: str
    property_address: Optional[str]
    analysis_name: Optional[str]
    is_public: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
