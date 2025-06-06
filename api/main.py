from fastapi import FastAPI
from routes import auth_router


app = FastAPI(title="G.R.A.C.E. API")

app.include_router(auth_router)
