from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.reports_service import ReportsService
from app.schemas.reports import ConsolidatedReport, ExportRequest
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])

@router.get("/consolidated", response_model=ConsolidatedReport)
async def get_consolidated_report(
    company_id: str = Query(..., description="The ID of the company"),
    period: str = Query(..., description="The reporting period (e.g., Q1-2026, 2026-FY)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a consolidated ESG report for a specific company and period.
    """
    service = ReportsService(db)
    return await service.get_consolidated_report(company_id, period)

@router.post("/export")
async def export_report(
    request: ExportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export the consolidated ESG report as PDF or XLSX.
    """
    service = ReportsService(db)
    report_data = await service.get_consolidated_report(request.company_id, request.period)
    
    if request.format.lower() == "pdf":
        pdf_buffer = await service.generate_pdf_report(report_data)
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=ESG_Report_{request.period}.pdf"}
        )
    elif request.format.lower() == "xlsx":
        xlsx_buffer = await service.generate_xlsx_report(report_data)
        return StreamingResponse(
            xlsx_buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=ESG_Report_{request.period}.xlsx"}
        )
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Use 'pdf' or 'xlsx'.")
