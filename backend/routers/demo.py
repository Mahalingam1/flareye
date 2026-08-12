from fastapi import APIRouter
from services.demo_controller import demo_controller

router = APIRouter(prefix="/api/demo", tags=["demo"])

@router.get("/steps")
async def get_demo_steps():
    return demo_controller.steps

@router.post("/start")
async def start_demo():
    demo_controller.is_demo_running = True
    demo_controller.current_step = 1
    return {"message": "Demo simulation started", "current_step": 1, "is_demo_running": True}

@router.post("/next")
async def next_demo_step():
    if demo_controller.current_step < len(demo_controller.steps):
        demo_controller.current_step += 1
    return {
        "current_step": demo_controller.current_step,
        "step_details": demo_controller.steps[demo_controller.current_step - 1]
    }

@router.post("/reset")
async def reset_demo():
    demo_controller.is_demo_running = False
    demo_controller.current_step = 0
    return {"message": "Demo reset to normal operating state", "is_demo_running": False}
