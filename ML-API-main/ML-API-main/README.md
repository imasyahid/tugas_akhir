# API Usage

## Deploy in Docker
```bash
docker-compose up --build
```

## Publish in Hugging Face Spaces
1. Change the **EXPOSE** and **CMD** in `Dockerfile`
```Dockerfile
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```
2. remove `joblib.dump()` in `preprocessor.py`
```python
joblib.dump(preprocessor, 'preprocessor.pkl')
```
3. Push to Hugging Face Spaces
