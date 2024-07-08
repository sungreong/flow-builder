# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용, 필요한 경우 특정 출처로 변경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NodeData(BaseModel):
    label: str

class ExecuteRequest(BaseModel):
    source: NodeData
    target: NodeData

@app.post("/execute")
async def execute(request: ExecuteRequest):
    # 간단한 예시로, 데이터를 처리하고 응답을 반환
    import time 
    time.sleep(5)

    print(f"Received source: {request.source}, target: {request.target}")
    return {"status": "success", "message": f"Processed {request.source.label} to {request.target.label}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
