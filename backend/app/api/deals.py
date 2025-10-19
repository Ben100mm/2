from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.deal import DealCreate, DealUpdate, DealResponse, PropertyAnalysisCreate, PropertyAnalysisResponse
from app.services.deal_service import DealService
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/deals", tags=["deals"])

@router.post("/", response_model=DealResponse)
async def create_deal(
    deal_data: DealCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new saved deal"""
    try:
        deal_service = DealService(db)
        deal = deal_service.create_deal(current_user.id, deal_data)
        return deal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[DealResponse])
async def get_user_deals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    archived: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's saved deals"""
    try:
        deal_service = DealService(db)
        deals = deal_service.get_user_deals(
            current_user.id, 
            skip=skip, 
            limit=limit, 
            archived=archived
        )
        return deals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific deal"""
    try:
        deal_service = DealService(db)
        deal = deal_service.get_deal(deal_id, current_user.id)
        if not deal:
            raise HTTPException(status_code=404, detail="Deal not found")
        return deal
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: str,
    deal_data: DealUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update deal"""
    try:
        deal_service = DealService(db)
        deal = deal_service.update_deal(deal_id, current_user.id, deal_data)
        if not deal:
            raise HTTPException(status_code=404, detail="Deal not found")
        return deal
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete deal"""
    try:
        deal_service = DealService(db)
        success = deal_service.delete_deal(deal_id, current_user.id)
        if not success:
            raise HTTPException(status_code=404, detail="Deal not found")
        return {"message": "Deal deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyses", response_model=PropertyAnalysisResponse)
async def create_property_analysis(
    analysis_data: PropertyAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new property analysis"""
    try:
        deal_service = DealService(db)
        analysis = deal_service.create_property_analysis(current_user.id, analysis_data)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analyses", response_model=List[PropertyAnalysisResponse])
async def get_user_analyses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's property analyses"""
    try:
        deal_service = DealService(db)
        analyses = deal_service.get_user_analyses(current_user.id, skip=skip, limit=limit)
        return analyses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
