import os
import re
import time
from concurrent.futures import ThreadPoolExecutor
import matplotlib.pyplot as plt
import moviepy.editor as mp
import requests
import spacy
import speech_recognition as sr
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS
from io import BytesIO
from requests import get
from string import punctuation
from tqdm import tqdm
from transformers import BartTokenizer, T5ForConditionalGeneration, T5Tokenizer, TFBartForConditionalGeneration
from youtube_transcript_api import YouTubeTranscriptApi as yta
from wordcloud import WordCloud
from heapq import nlargest
from werkzeug.utils import secure_filename
from spacy.lang.en.stop_words import STOP_WORDS
import huggingface_hub as hf_hub
from huggingface_hub import HfApi, HfFolder
from requests.exceptions import HTTPError

# Create a Flask app
app = Flask(__name__)
CORS(app)

# Function to extract video ID from YouTube link
def extract_video_id(youtube_link):
    pattern = re.compile(r'(?<=v=)[a-zA-Z0-9_-]+(?=&|\b|$)')
    match = pattern.search(youtube_link)
    if match:
        return match.group()
    else:
        return None


@app.route('/', methods=['GET'])
def hello():
    h = "<h1>This is the backend deployed web page created by NotivAI!!</h1>"
    return h
    

    
# Route for uploading video files
@app.route('/upload_video', methods=['POST'])
def upload_video():
    start_time = time.time()
    if 'video' not in request.files:
        return jsonify({'error': 'No video file found in the request'})
    video = request.files['video']
    if video.mimetype.split('/')[0] != 'video':
        return jsonify({'error': 'The file uploaded is not a video'})

    model_name = request.form.get('modelName')
    print("MODEL:", model_name)

    video_path = os.path.join(os.getcwd(), secure_filename(video.filename))
    video.save(video_path)

    # Initialize HfApi and HfFolder
    api = HfApi()
    folder = HfFolder()

    token = folder.get_token()
    namespace = "Dhrumit1314/videoUpload"

    # Upload the video file
    video_file_id = api.upload_file(
        token=token,
        path_or_fileobj=video_path,
        repo_id=namespace,
        path_in_repo=video.filename
    )

    transcript = transcribe_audio(video_path)

    summary = ""
    if model_name == 'T5':
        summary = summarize_text_t5(transcript)
    elif model_name == 'BART':
        summary = summarize_text_bart(transcript)
    else:
        summary = summarizer(transcript)

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Video saved successfully. Time taken: {elapsed_time} seconds")

    return jsonify({'message': 'successful', 'transcript': transcript, 'summary': summary, 'modelName': model_name, 'videoFileId': video_file_id})

        
# def upload_video():
#     start_time = time.time()
#     if 'video' not in request.files:
#         return jsonify({'error': 'No video file found in the request'})
#     video = request.files['video']
#     if video.mimetype.split('/')[0] != 'video':
#         return jsonify({'error': 'The file uploaded is not a video'})

#     model_name = request.form.get('modelName')
#     print("MODEL:", model_name)

#     # backend_folder = 'backend_videos'
#     # if not os.path.exists(backend_folder):
#     #     os.makedirs(backend_folder)
#     video_path = os.path.join(os.getcwd(), secure_filename(video.filename))
#     video.save(video_path)

#     transcript = transcribe_audio(video_path)

#     summary = ""
#     if model_name == 'T5':
#         summary = summarize_text_t5(transcript)
#     elif model_name == 'BART':
#         summary = summarize_text_bart(transcript)
#     else:
#         summary = summarizer(transcript)

#     end_time = time.time()
#     elapsed_time = end_time - start_time
#     print(f"Video saved successfully. Time taken: {elapsed_time} seconds")

#     return jsonify({'message': 'successful', 'transcript': transcript, 'summary': summary, 'modelName': model_name})

# Route for uploading YouTube video links
@app.route('/youtube_upload_video', methods=['POST'])
def upload_youtube_video():
    start_time = time.time()
    transcript = "Testing text"
    summary = "Testing text"

    model_name = request.form.get('modelName')
    youtube_link = request.form.get('link')
    print('link', youtube_link)
    video_id = extract_video_id(youtube_link)
    if video_id is None:
        return jsonify({'message': 'successful', 'transcript': "error with youtube link", 'summary': "error with youtube link", 'modelName': model_name})
    
    transcript = generate_and_save_transcript_with_visuals(video_id)
    summary = ""
    if model_name == 'T5':
        summary = summarize_text_t5(transcript)
    elif model_name == 'BART':
        summary = summarize_text_bart(transcript)
    else:
        summary = summarizer(transcript)

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Video saved successfully. Time taken: {elapsed_time} seconds")

    return jsonify({'message': 'successful', 'transcript': transcript, 'summary': summary, 'modelName': model_name})

# Function to generate transcript and visuals for YouTube videos
def generate_and_save_transcript_with_visuals(video_id, file_name="yt_generated_transcript.txt"):
    try:
        data = yta.get_transcript(video_id)
        transcript = ''
        for value in tqdm(data, desc="Downloading Transcript", unit=" lines"):
            for key, val in value.items():
                if key == 'text':
                    transcript += val + ' '
        transcript = transcript.strip()
        return transcript
    except Exception as e:
        print(f"Error: {str(e)}")

# Transcribe audio from video
def transcribe_audio(file_path, chunk_duration=30):
    video = mp.VideoFileClip(file_path)
    audio = video.audio
    audio.write_audiofile("sample_audio.wav", codec='pcm_s16le')

    r = sr.Recognizer()
    with sr.AudioFile("sample_audio.wav") as source:
        audio = r.record(source)

    total_duration = len(audio.frame_data) / audio.sample_rate
    total_chunks = int(total_duration / chunk_duration) + 1

    all_text = []

    def transcribe_chunk(start):
        nonlocal all_text
        chunk = audio.get_segment(start * 1000, (start + chunk_duration) * 1000)
        try:
            text = r.recognize_google(chunk)
            all_text.append(text)
            print(f" Chunk {start}-{start+chunk_duration}: {text}")
        except sr.UnknownValueError:
            all_text.append("")
        except sr.RequestError as e:
            all_text.append(f"[Error: {e}]")

    num_threads = min(total_chunks, total_chunks + 5)
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        list(tqdm(executor.map(transcribe_chunk, range(0, int(total_duration), chunk_duration)),
                  total=total_chunks, desc="Transcribing on multithreading: "))

    wordcloud = WordCloud(width=800, height=400, background_color="white").generate(' '.join(all_text))
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis("off")
    plt.show()

    return ' '.join(all_text)

# Load pre-trained models and tokenizers
tokenizer_bart = BartTokenizer.from_pretrained('facebook/bart-large')
tokenizer_t5 = T5Tokenizer.from_pretrained('t5-small')

with tf.device('/CPU:0'):
    model_t5 = T5ForConditionalGeneration.from_pretrained("Dhrumit1314/T5_TextSummary")
    model_bart = TFBartForConditionalGeneration.from_pretrained("Dhrumit1314/BART_TextSummary")

# Function to summarize text using T5 model
def summarize_text_t5(text):
    start_time = time.time()
    t5_prepared_Text = "summarize: "+text
    tokenized_text = tokenizer_t5.encode(t5_prepared_Text, return_tensors="pt")
    summary_ids = model_t5.generate(tokenized_text,
                                    num_beams=4,
                                    no_repeat_ngram_size=2,
                                    min_length=256,
                                    max_length=512,
                                    early_stopping=True)
    output = tokenizer_t5.decode(summary_ids[0], skip_special_tokens=True)
    end_time = time.time()
    print(f"Execution time for T5 Model: {end_time - start_time} seconds")
    return output

def summarize_text_bart(text):
    start_time = time.time()
    inputs = tokenizer_bart([text], max_length=1024, return_tensors='tf')
    summary_ids = model_bart.generate(inputs['input_ids'], num_beams=4, max_length=256, early_stopping=True)
    output = [tokenizer_bart.decode(g, skip_special_tokens=True, clean_up_tokenization_spaces=False) for g in summary_ids]
    end_time = time.time()
    print(f"Execution time for BART Model: {end_time - start_time} seconds")
    return output[0]

# Spacy Summarizer
def summarizer(rawdocs):
    stopwords = list(STOP_WORDS)
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(rawdocs)
    tokens = [token.text for token in doc]
    word_freq = {}
    for word in doc:
        if word.text.lower() not in stopwords and word.text.lower() not in punctuation:
            if word.text not in word_freq.keys():
                word_freq[word.text] = 1
            else:
                word_freq[word.text] += 1

    max_freq = max(word_freq.values())

    for word in word_freq.keys():
        word_freq[word] = word_freq[word]/max_freq

    sent_tokens = [sent for sent in doc.sents]

    sent_scores = {}

    for sent in sent_tokens:
        for word in sent:
            if word.text in word_freq.keys():
                if sent not in sent_scores.keys():
                    sent_scores[sent] = word_freq[word.text]
                else:
                    sent_scores[sent] += word_freq[word.text]

    select_len = int(len(sent_tokens) * 0.3)
    summary = nlargest(select_len, sent_scores, key=sent_scores.get)
    final_summary = [word.text for word in summary]
    summary = ' '.join(final_summary)

    return summary

# Main run function
if __name__ == '__main__':
    app.run(debug=True, port=7860, host='0.0.0.0', use_reloader=False)