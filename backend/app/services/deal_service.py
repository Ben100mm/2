from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.deal import SavedDeal, PropertyAnalysis
from app.schemas.deal import DealCreate, DealUpdate, PropertyAnalysisCreate
import uuid

class DealService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_deal(self, user_id: str, deal_data: DealCreate) -> SavedDeal:
        """Create new saved deal"""
        deal = SavedDeal(
            user_id=user_id,
            deal_name=deal_data.deal_name,
            property_address=deal_data.property_address,
            property_type=deal_data.property_type,
            operation_type=deal_data.operation_type,
            deal_data=deal_data.deal_data,
            tags=deal_data.tags or []
        )
        
        self.db.add(deal)
        self.db.commit()
        self.db.refresh(deal)
        
        return deal
    
    def get_user_deals(self, user_id: str, skip: int = 0, limit: int = 100, archived: Optional[bool] = None) -> List[SavedDeal]:
        """Get user's saved deals"""
        query = self.db.query(SavedDeal).filter(SavedDeal.user_id == user_id)
        
        if archived is not None:
            query = query.filter(SavedDeal.is_archived == archived)
        
        return query.offset(skip).limit(limit).all()
    
    def get_deal(self, deal_id: str, user_id: str) -> Optional[SavedDeal]:
        """Get specific deal by ID"""
        return self.db.query(SavedDeal).filter(
            SavedDeal.id == deal_id,
            SavedDeal.user_id == user_id
        ).first()
    
    def update_deal(self, deal_id: str, user_id: str, deal_data: DealUpdate) -> Optional[SavedDeal]:
        """Update deal"""
        deal = self.get_deal(deal_id, user_id)
        if not deal:
            return None
        
        update_data = deal_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(deal, field, value)
        
        self.db.commit()
        self.db.refresh(deal)
        
        return deal
    
    def delete_deal(self, deal_id: str, user_id: str) -> bool:
        """Delete deal"""
        deal = self.get_deal(deal_id, user_id)
        if not deal:
            return False
        
        self.db.delete(deal)
        self.db.commit()
        
        return True
    
    def create_property_analysis(self, user_id: str, analysis_data: PropertyAnalysisCreate) -> PropertyAnalysis:
        """Create new property analysis"""
        analysis = PropertyAnalysis(
            user_id=user_id,
            property_id=analysis_data.property_id,
            analysis_type=analysis_data.analysis_type,
            analysis_data=analysis_data.analysis_data,
            property_address=analysis_data.property_address,
            analysis_name=analysis_data.analysis_name,
            is_public=analysis_data.is_public
        )
        
        self.db.add(analysis)
        self.db.commit()
        self.db.refresh(analysis)
        
        return analysis
    
    def get_user_analyses(self, user_id: str, skip: int = 0, limit: int = 100) -> List[PropertyAnalysis]:
        """Get user's property analyses"""
        return self.db.query(PropertyAnalysis).filter(
            PropertyAnalysis.user_id == user_id
        ).offset(skip).limit(limit).all()
    
    def get_analysis(self, analysis_id: str, user_id: str) -> Optional[PropertyAnalysis]:
        """Get specific analysis by ID"""
        return self.db.query(PropertyAnalysis).filter(
            PropertyAnalysis.id == analysis_id,
            PropertyAnalysis.user_id == user_id
        ).first()
