# 🎬 AI Video Assistant — Complete Project Explanation in Hinglish

> **Yeh document tumhare poore AI Video Assistant project ko LINE BY LINE samjhayega.**
> Har file, har function, har line — sab kuch detail mein.
> Jab tum yeh poora padh loge, toh tumhe crystal clear samajh aa jayega ki yeh project kya karta hai aur kaise karta hai.

---

## 📑 Table of Contents

1. [Project Ka Big Picture](#1--project-ka-big-picture)
2. [Project Structure (Folder/File Layout)](#2--project-structure)
3. [Requirements.txt — Dependencies](#3--requirementstxt--dependencies)
4. [.gitignore](#4--gitignore)
5. [utils/audio_processor.py — Audio Download & Chunking](#5--utilsaudio_processorpy--audio-download--chunking)
6. [core/transcriber.py — Speech to Text](#6--coretranscriber)
7. [core/summarizer.py — Summarization & Title Generation](#7--coresummarizerpy--summarization--title-generation)
8. [core/extractor.py — Action Items, Decisions, Questions](#8--coreextractorpy--action-items-decisions-questions)
9. [core/vector_store.py — ChromaDB Vector Store](#9--corevector_storepy--chromadb-vector-store)
10. [core/rag_engine.py — RAG (Retrieval Augmented Generation)](#10--corerag_enginepy--rag-retrieval-augmented-generation)
11. [main.py — CLI Entry Point](#11--mainpy--cli-entry-point)
12. [test.py — Quick Testing Script](#12--testpy--quick-testing-script)
13. [app.py — Streamlit Web UI (Full Breakdown)](#13--apppy--streamlit-web-ui-full-breakdown)
14. [Data Flow Diagram — Poora Pipeline Kaise Chalta Hai](#14--data-flow-diagram)
15. [Concepts Deep Dive](#15--concepts-deep-dive)

---

---

# 1. 🌍 Project Ka Big Picture

## Yeh Project Kya Hai?

Socho tumhare paas ek **YouTube video** hai ya koi **local audio/video file** hai — maybe ek meeting recording, ek lecture, ya koi bhi video jisme log bol rahe hain.

**AI Video Assistant** kya karega:

```
Video/Audio Input
      ↓
┌─────────────────────────────┐
│  Step 1: Audio Download     │  ← YouTube se audio download karega
│          & Chunking         │  ← Bade audio ko chhote chunks mein todega
├─────────────────────────────┤
│  Step 2: Transcription      │  ← Audio ko text mein convert karega
│          (Speech → Text)    │  ← English = Whisper, Hinglish = Sarvam AI
├─────────────────────────────┤
│  Step 3: Title Generation   │  ← Meeting ka professional title banayega
├─────────────────────────────┤
│  Step 4: Summarization      │  ← Full transcript ka summary banayega
├─────────────────────────────┤
│  Step 5: Extraction         │  ← Action items, decisions, questions nikalega
├─────────────────────────────┤
│  Step 6: RAG Engine         │  ← Transcript ko vector DB mein daalega
│          (Chat Feature)     │  ← Tum apni meeting se CHAT kar sakte ho!
└─────────────────────────────┘
```

## Kaunsi Technologies Use Ho Rahi Hain?

| Technology | Kya Kaam Karti Hai | Samjho Aise |
|---|---|---|
| **yt-dlp** | YouTube se audio download | YouTube ka downloader |
| **pydub** | Audio file ko manipulate karna | Audio ki kainchi — kaatna, convert karna |
| **FFmpeg** | Audio/video processing backend | Pydub ke peeche ka engine |
| **OpenAI Whisper** | Speech-to-Text (English) | AI jo bolna sun ke likhta hai |
| **Sarvam AI** | Speech-to-Text (Hinglish) | Indian languages ke liye special AI |
| **LangChain** | LLM orchestration framework | LLM ke saath kaam karne ka framework |
| **Mistral AI** | LLM (Large Language Model) | Jo text samajhta hai aur generate karta hai |
| **ChromaDB** | Vector database | Text ko numbers mein store karta hai search ke liye |
| **HuggingFace** | Embedding models | Text ko mathematical vectors mein convert karta hai |
| **Streamlit** | Web UI framework | Python se web app banana |
| **python-dotenv** | Environment variables load karna | API keys safely rakhna |

## Architecture Ka Overview

```
┌──────────────────────────────────────────────────────────┐
│                    USER INTERFACE                         │
│  ┌──────────────┐           ┌──────────────────────┐     │
│  │  main.py     │           │  app.py              │     │
│  │  (CLI Mode)  │           │  (Streamlit Web UI)  │     │
│  └──────┬───────┘           └──────────┬───────────┘     │
│         │                              │                 │
│         └──────────┬───────────────────┘                 │
│                    ↓                                     │
│         ┌──────────────────────┐                         │
│         │  PIPELINE ENGINE     │                         │
│         └──────────┬───────────┘                         │
│                    │                                     │
│    ┌───────────────┼───────────────────┐                 │
│    ↓               ↓                   ↓                 │
│ ┌────────┐  ┌────────────┐  ┌───────────────┐           │
│ │ utils/ │  │   core/    │  │    core/      │           │
│ │ audio  │  │ transcriber│  │ summarizer    │           │
│ │ proc.  │  │            │  │ extractor     │           │
│ │        │  │            │  │ rag_engine    │           │
│ │        │  │            │  │ vector_store  │           │
│ └────────┘  └────────────┘  └───────────────┘           │
│                                                          │
│ ┌────────────────────────────────────────────────────┐   │
│ │              EXTERNAL SERVICES                     │   │
│ │  Whisper (local)  │  Sarvam API  │  Mistral API   │   │
│ └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

---

# 2. 📁 Project Structure

```
AI-Video-Assistant--main/
│
├── .gitignore                 ← Git ko bata raha hai ki .env file ko track mat karo
├── .env                       ← API keys yahan hain (gitignore ki wajah se git mein nahi jayegi)
├── Requirements.txt           ← Saari dependencies ki list
│
├── main.py                    ← CLI (Command Line Interface) se project chalane ke liye
├── test.py                    ← Quick testing script — ek YouTube URL pe test karne ke liye
├── app.py                     ← Streamlit Web UI — browser mein chalega, beautiful UI ke saath
│
├── utils/                     ← Utility functions
│   └── audio_processor.py     ← YouTube se download + audio chunking
│
└── core/                      ← Core business logic
    ├── transcriber.py         ← Speech-to-Text (Whisper + Sarvam)
    ├── summarizer.py          ← LLM se transcript ka summary banana
    ├── extractor.py           ← Action items, decisions, questions extract karna
    ├── vector_store.py        ← ChromaDB mein transcript store karna
    └── rag_engine.py          ← RAG chain banana — meeting se chat karne ke liye
```

### Kyun do folders hain — `utils/` aur `core/`?

**`utils/`** = Helper/utility functions. Yeh directly business logic nahi hai, yeh kaam karne ke tools hain.
- Audio download karna
- Audio ko WAV mein convert karna
- Audio ko chunks mein todna

**`core/`** = Main brain. Actual intelligent processing yahan hoti hai.
- Transcription (speech → text)
- Summarization (text → summary)
- Extraction (text → action items)
- RAG (text → searchable chat)

Socho aise: `utils/` hai jaise kitchen ka chopping board — woh ingredients prepare karta hai.
`core/` hai jaise chef — jo actual cooking karta hai.

---

---

# 3. 📦 Requirements.txt — Dependencies

Yeh file batati hai ki is project ko chalane ke liye kaunsi Python libraries chahiye.

```
# ── AI Meeting Assistant ── requirements.txt ──────────────────────────────────
# Python >= 3.10 recommended
```

**Line 1-2:** Yeh comment hai. Bata raha hai ki Python 3.10 ya usse upar ka version recommended hai.
Kyun? Kyunki kuch libraries (jaise `match-case`, newer type hints) ko Python 3.10+ chahiye.

---

### Audio / Video Acquisition

```python
yt-dlp>=2024.4.9                  # Download audio from YouTube URLs
```

**`yt-dlp`** — Yeh `youtube-dl` ka successor hai (improved fork). Yeh YouTube se audio/video download karta hai. `>=2024.4.9` ka matlab hai version 2024.4.9 ya usse naya chahiye.

Kyun `youtube-dl` nahi? Kyunki `youtube-dl` bahut slow ho gaya tha updates mein aur bahut si sites pe kaam karna band kar diya tha. `yt-dlp` maintained hai aur faster hai.

```python
pydub>=0.25.1                     # Audio file manipulation / format conversion
```

**`pydub`** — Python library hai audio files ke saath kaam karne ke liye. Isse tum:
- Audio ko ek format se doosre mein convert kar sakte ho (MP3 → WAV)
- Audio ko kaatna (chunking)
- Channels change karna (stereo → mono)
- Sample rate change karna

```python
ffmpeg-python>=0.2.0              # FFmpeg bindings (FFmpeg binary must be installed separately)
```

**`ffmpeg-python`** — FFmpeg ke Python bindings. **FFmpeg** ek bahut powerful audio/video processing tool hai jo command line pe chalta hai. `pydub` internally FFmpeg hi use karta hai. Dhyan do: FFmpeg binary alag se install karna padta hai (yeh sirf Python wrapper hai).

---

### Speech-to-Text (Local Whisper)

```python
openai-whisper>=20231117          # OpenAI Whisper (runs locally)
```

**`openai-whisper`** — OpenAI ka Whisper model. Yeh LOCALLY chalta hai (koi API call nahi, koi internet nahi chahiye). Yeh audio sunke text likhta hai. Bahut accurate hai English ke liye.

```python
torch>=2.2.0                      # PyTorch backend for Whisper
```

**`torch`** (PyTorch) — Deep learning ka framework. Whisper model PyTorch pe bana hai, toh isko run karne ke liye PyTorch chahiye.

```python
torchaudio>=2.2.0                 # Audio utilities for PyTorch
```

**`torchaudio`** — PyTorch ke saath audio processing ke liye special utilities.

---

### Translation (Hindi → English)

```python
deep-translator>=1.11.4           # Lightweight translation wrapper (Google backend)
```

**`deep-translator`** — Yeh ek lightweight library hai jo Google Translate (aur dusre translation services) ko wrap karti hai. Agar Hindi text ko English mein translate karna ho toh yeh use hoga. (Note: is project mein directly use nahi dikh raha, lekin dependency mein rakha hai future use ya Sarvam ke fallback ke liye.)

---

### LLM Orchestration — LangChain + Mistral

```python
langchain>=0.2.0
langchain-core>=0.2.0
langchain-community>=0.2.0
```

**LangChain** — Yeh ek framework hai LLMs (Large Language Models) ke saath kaam karne ke liye. Socho isse aise:
- `langchain` = Main framework
- `langchain-core` = Core building blocks (Prompts, Parsers, Runnables)
- `langchain-community` = Community-contributed integrations (different LLMs, databases, etc.)

LangChain kyun use karte hain? Kyunki directly API call karna mushkil hota hai jab complex chains banana ho. LangChain tumhe "building blocks" deta hai jaise:
- **PromptTemplate** — LLM ko kya bolna hai, uska template
- **Chain** — Multiple steps ko ek pipeline mein jodte hai
- **OutputParser** — LLM ka output clean karta hai

```python
langchain-mistralai>=0.1.0        # LangChain wrapper for Mistral API
```

**`langchain-mistralai`** — LangChain ka Mistral AI ke liye wrapper. Isse `ChatMistralAI` class milti hai jo Mistral ke models ko LangChain chains mein use karne deti hai.

```python
mistralai>=0.4.0                  # Official Mistral Python client
```

**`mistralai`** — Mistral AI ka official Python SDK. `langchain-mistralai` internally isko use karta hai.

---

### RAG Pipeline

```python
chromadb>=0.5.0                   # Local vector store
```

**`chromadb`** — Yeh ek **vector database** hai. 

**Vector database kya hai?** 🤔

Normal database mein tum text store karte ho aur exact match se search karte ho.
Vector database mein text ko **numbers (vectors/embeddings)** mein convert karke store karte ho, aur phir **semantic search** karte ho.

Example:
- Normal search: "meeting" dhundho → sirf woh results aayenge jahan exactly "meeting" likha ho
- Semantic search: "meeting" dhundho → "conference", "discussion", "call" bhi mil sakte hain kyunki meaning similar hai

ChromaDB local mein chalta hai, koi external server nahi chahiye.

```python
sentence-transformers>=3.0.0      # HuggingFace embedding models
```

**`sentence-transformers`** — HuggingFace ki library jo text ko vectors/embeddings mein convert karti hai. Yeh internally transformer models use karti hai (jaise BERT ke variants).

```python
langchain-huggingface>=0.0.3      # LangChain ↔ HuggingFace embeddings bridge
```

**`langchain-huggingface`** — LangChain aur HuggingFace ke beech ka bridge. Isse LangChain chains mein HuggingFace ke embedding models directly use ho sakte hain.

```python
huggingface-hub>=0.23.0           # Model downloading from HuggingFace Hub
```

**`huggingface-hub`** — HuggingFace Hub se models download karne ke liye. Pehli baar jab tum run karoge, yeh embedding model download karega.

```python
tiktoken>=0.7.0                   # Token counting for text splitting
```

**`tiktoken`** — OpenAI ka token counter. Jab text ko split karna hota hai (chunking), toh yeh accurately count karta hai kitne tokens hain. Kyun chahiye? Kyunki LLMs ki limit hoti hai (e.g., 8000 tokens). Toh text ko uss limit ke andar rakhna padta hai.

---

### Streamlit UI

```python
streamlit>=1.35.0
```

**`streamlit`** — Python se web apps banane ka framework. Tum Python code likhte ho, aur yeh automatically ek beautiful web interface bana deta hai. No HTML/CSS/JS manually likhne ki zarurat nahi (lekin tum likh sakte ho agar advanced customization chahiye, jaise is project mein kiya hai).

```python
streamlit-extras>=0.4.0           # Additional Streamlit widgets / utilities
```

**`streamlit-extras`** — Extra widgets aur utilities Streamlit ke liye.

```python
watchdog>=4.0.0                   # File-change watcher (improves Streamlit hot-reload)
```

**`watchdog`** — File changes detect karta hai. Streamlit development mein jab tum code change karte ho, yeh automatically app reload kar deta hai.

---

### PDF & TXT Export

```python
reportlab>=4.2.0                  # PDF generation
fpdf2>=2.7.9                      # Lightweight alternative PDF library
```

**`reportlab`** aur **`fpdf2`** — PDF generate karne ke liye. Agar future mein meeting summary ko PDF mein export karna ho. (Currently code mein actively use nahi ho raha, lekin dependency mein hai future feature ke liye.)

---

### Utilities

```python
python-dotenv>=1.0.0              # Load API keys from .env
```

**`python-dotenv`** — `.env` file se environment variables load karta hai. API keys ko code mein hardcode karna security risk hai, toh unhe `.env` file mein rakhte hain aur `load_dotenv()` se load karte hain.

```python
numpy>=1.26.0
```

**`numpy`** — Python ka mathematical/numerical computing library. Whisper aur embedding models internally NumPy arrays use karte hain.

```python
tqdm>=4.66.0                      # Progress bars
```

**`tqdm`** — Terminal mein progress bars dikhane ke liye. Jab long-running tasks ho rahe hon toh user ko pata chale kitna complete hua.

```python
requests>=2.32.0
```

**`requests`** — HTTP requests bhejne ke liye. Sarvam AI ke API ko call karne ke liye use hota hai.

---

---

# 4. 🙈 .gitignore

```
.env
```

Bas itna hi hai is file mein. Ek hi line.

**Matlab:** Git ko bol rahe hain ki `.env` file ko KABHI track mat karo. Kyun? Kyunki `.env` mein tumhari API keys hain:
- `MISTRAL_API_KEY`
- `SARVAM_API_KEY`
- etc.

Agar yeh galti se GitHub pe push ho gayi toh koi bhi tumhari API keys chura sakta hai aur tumhare naam pe use kar sakta hai. Isliye `.gitignore` mein `.env` dalna **SECURITY BEST PRACTICE** hai.

### `.env` File Kaisi Dikhti Hai (Example)

```env
MISTRAL_API_KEY=your-mistral-api-key-here
SARVAM_API_KEY=your-sarvam-api-key-here
WHISPER_MODEL=small
SARVAM_STT_MODEL=saaras:v2.5
```

---

---

# 5. 🔊 utils/audio_processor.py — Audio Download & Chunking

> **Yeh file audio processing ke liye hai.**
> - YouTube se audio download karega
> - Local file ko WAV mein convert karega
> - Bade audio ko chhote chunks mein todega

---

### Line 1-3: Imports

```python
import yt_dlp                   # Line 1
from pydub import AudioSegment  # Line 2
import os                       # Line 3
```

**Line 1:** `yt_dlp` import kar rahe hain — yeh YouTube se audio download karega.

**Line 2:** `pydub` se `AudioSegment` class import kar rahe hain. `AudioSegment` ek audio file ka representation hai — isse tum audio ko load, cut, convert, export sab kar sakte ho. Socho isse aise: `AudioSegment` = ek audio file ka Python object.

**Line 3:** `os` — Python ka built-in module. File system operations ke liye — folders banana, path join karna, files exist check karna, etc.

---

### Line 5-6: Download Directory Setup

```python
DOWNLOAD_DIR = 'downloades'                    # Line 5
os.makedirs(DOWNLOAD_DIR, exist_ok=True)       # Line 6
```

**Line 5:** `DOWNLOAD_DIR` ek constant variable hai (uppercase convention se pata chalta hai ki yeh constant hai). Value hai `'downloades'` — ek folder ka naam jahan downloaded audio files rakhenge.

> 💡 Note: Yahan `'downloades'` spelling mein typo hai — hona chahiye `'downloads'`. Lekin code chalega kyunki yeh bas ek folder ka naam hai.

**Line 6:** `os.makedirs(DOWNLOAD_DIR, exist_ok=True)` — Yeh `downloades` naam ka folder banayega.
- `os.makedirs()` — Folder create karta hai (aur agar parent folders nahi hain toh woh bhi bana deta hai)
- `exist_ok=True` — Agar folder pehle se exist karta hai toh error mat do, ignore karo. Agar `exist_ok=False` hota (default), toh folder already exist hone pe `FileExistsError` aata.

**IMPORTANT:** Yeh line module import hote hi execute hoti hai. Matlab jaise hi koi `from utils.audio_processor import process_input` karega, yeh folder bann jayega.

---

### Line 8-25: YouTube Audio Download Function

```python
def download_youtube_audio(url: str) -> str:       # Line 8
```

**Line 8:** Function define kar rahe hain `download_youtube_audio`.
- Parameter: `url: str` — YouTube ka URL (type hint hai ki yeh string hoga)
- Return type: `-> str` — Yeh downloaded file ka path return karega (string mein)

```python
    output_path = os.path.join(DOWNLOAD_DIR, "%(title)s.%(ext)s")    # Line 9
```

**Line 9:** Output file ka path bana rahe hain.
- `os.path.join(DOWNLOAD_DIR, "%(title)s.%(ext)s")` — `DOWNLOAD_DIR` ke andar file save hogi
- `"%(title)s.%(ext)s"` — Yeh `yt-dlp` ka template syntax hai:
  - `%(title)s` — Video ka title (e.g., "My Meeting Recording")
  - `%(ext)s` — File extension (e.g., "wav")
  - Result: `downloades/My Meeting Recording.wav`

```python
    ydl_opts = {                                    # Line 10
        "format": "bestaudio/best",                 # Line 11
        "outtmpl": output_path,                     # Line 12
        "postprocessors": [                         # Line 13
            {                                       # Line 14
                "key": "FFmpegExtractAudio",        # Line 15
                "preferredcodec": "wav",            # Line 16
                "preferredquality": "192",          # Line 17
            }                                       # Line 18
        ],                                          # Line 19
        "quiet": True,                              # Line 20
    }                                               # Line 21
```

**Line 10-21:** `yt_dlp` ke configuration options ka dictionary bana rahe hain.

- **Line 11:** `"format": "bestaudio/best"` — Best audio quality download karo. Slash ke baad `best` fallback hai — agar sirf audio available nahi hai toh best overall quality download karo.

- **Line 12:** `"outtmpl": output_path` — Output template — file kahan aur kis naam se save hogi.

- **Line 13-19:** `"postprocessors"` — Download hone ke baad kya karna hai:
  - **Line 15:** `"key": "FFmpegExtractAudio"` — FFmpeg use karke audio extract karo
  - **Line 16:** `"preferredcodec": "wav"` — WAV format mein convert karo. WAV kyun? Kyunki Whisper aur Sarvam ko uncompressed audio chahiye for best accuracy.
  - **Line 17:** `"preferredquality": "192"` — 192 kbps quality (good quality)

- **Line 20:** `"quiet": True` — Download ke dauran terminal pe bahut saari logs mat dikhao.

```python
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:         # Line 22
        info = ydl.extract_info(url, download=True)  # Line 23
        filename = ydl.prepare_filename(info).replace(".webm", ".wav").replace(".m4a", ".wav")  # Line 24
    return filename                                   # Line 25
```

**Line 22:** `yt_dlp.YoutubeDL(ydl_opts)` — YoutubeDL ka object bana rahe hain options ke saath. `with` statement use kar rahe hain (context manager) taaki resources properly cleanup ho jayein.

**Line 23:** `ydl.extract_info(url, download=True)` — Yeh do kaam karta hai:
1. Video ki info extract karta hai (title, duration, etc.)
2. `download=True` ki wajah se audio download bhi karta hai
- `info` mein ek dictionary aati hai jisme video ki saari metadata hoti hai

**Line 24:** `ydl.prepare_filename(info)` — Info se actual filename generate karta hai. Phir `.replace(".webm", ".wav").replace(".m4a", ".wav")` — kyunki postprocessor ne file ko WAV mein convert kiya hai, lekin `prepare_filename` original extension return karta hai. Toh manually replace kar rahe hain.

**Line 25:** Downloaded file ka path return kar rahe hain.

---

### Line 29-35: WAV Conversion Function

```python
def convert_to_wav(input_path: str) -> str:                          # Line 29
    """Convert any audio/video file to WAV format using pydub."""     # Line 30
    output_path = os.path.splitext(input_path)[0] + "_converted.wav" # Line 31
    audio = AudioSegment.from_file(input_path)                       # Line 32
    audio = audio.set_channels(1).set_frame_rate(16000)              # Line 33
    audio.export(output_path, format="wav")                          # Line 34
    return output_path                                                # Line 35
```

**Line 29:** Function define kar rahe hain — local file ko WAV mein convert karne ke liye.

**Line 30:** Docstring — function kya karta hai, uska description.

**Line 31:** Output file ka path bana rahe hain.
- `os.path.splitext(input_path)` — File path ko do parts mein todta hai:
  - `("path/to/file", ".mp4")` → naam aur extension alag
- `[0]` — Sirf naam le rahe hain (bina extension ke)
- `+ "_converted.wav"` — Naam ke baad `_converted.wav` jod rahe hain
- Example: `"meeting.mp4"` → `"meeting_converted.wav"`

**Line 32:** `AudioSegment.from_file(input_path)` — Koi bhi audio/video file load kar rahe hain. Pydub internally FFmpeg use karta hai, toh almost har format support karta hai (MP3, MP4, MKV, FLV, AVI, etc.)

**Line 33:** `audio.set_channels(1).set_frame_rate(16000)` — Do cheezein kar rahe hain:
- `.set_channels(1)` — **Mono** bana rahe hain (1 channel). Speech recognition models ke liye mono audio best hota hai. Stereo (2 channels) mein dono channels mein same voice hota hai meetings mein, toh mono mein convert karna efficient hai.
- `.set_frame_rate(16000)` — **16kHz sample rate** set kar rahe hain. Whisper 16kHz pe best kaam karta hai. Original audio 44.1kHz ya 48kHz hota hai, lekin speech ke liye 16kHz kaafi hai (human speech 300Hz-3400Hz range mein hota hai, 16kHz Nyquist theorem ke according isse easily capture karta hai).

**Line 34:** `audio.export(output_path, format="wav")` — Converted audio ko WAV file mein save kar rahe hain.

**Line 35:** Converted file ka path return kar rahe hain.

---

### Line 39-52: Audio Chunking Function

```python
def chunk_audio(wav_path: str, chunk_minutes: int = 10) -> list:   # Line 39
    audio = AudioSegment.from_wav(wav_path)                         # Line 40
    chunk_ms = chunk_minutes * 60 * 1000                            # Line 41
```

**Line 39:** Function define kar rahe hain — ek bada audio file ko chhote chunks mein todne ke liye.
- `wav_path: str` — WAV file ka path
- `chunk_minutes: int = 10` — Har chunk kitne minutes ka hoga (default 10 minutes)
- `-> list` — Chunk files ke paths ki list return karega

**Line 40:** WAV file load kar rahe hain `AudioSegment.from_wav()` se.

**Line 41:** Minutes ko milliseconds mein convert kar rahe hain.
- `chunk_minutes * 60` — Minutes → seconds (10 * 60 = 600 seconds)
- `* 1000` — Seconds → milliseconds (600 * 1000 = 600,000 ms)
- Kyun milliseconds? Kyunki `pydub` internally milliseconds mein kaam karta hai.

```python
    chunks = []                                                     # Line 43
```

**Line 43:** Empty list bana rahe hain jisme chunk file paths store honge.

```python
    for i, start in enumerate(range(0, len(audio), chunk_ms)):     # Line 45
        chunk = audio[start : start + chunk_ms]                     # Line 46
        chunk_path = f"{wav_path}_chunk_{i}.wav"                    # Line 47
        chunk.export(chunk_path, format="wav")                      # Line 48
        chunks.append(chunk_path)                                   # Line 50
```

**Line 45:** Loop chal raha hai audio ke upar, `chunk_ms` ke steps mein.
- `range(0, len(audio), chunk_ms)` — 0 se audio ki total length tak, har `chunk_ms` pe ek step
- `len(audio)` — Audio ki total length milliseconds mein (e.g., 30 minute audio = 1,800,000 ms)
- `enumerate()` — Counter bhi de raha hai (i = 0, 1, 2, ...)

Example agar audio 25 minutes ka hai aur chunk_minutes = 10:
- `range(0, 1500000, 600000)` → `[0, 600000, 1200000]`
- Chunk 0: 0-10 min
- Chunk 1: 10-20 min
- Chunk 2: 20-25 min (last chunk chhota hoga)

**Line 46:** `audio[start : start + chunk_ms]` — Pydub mein slicing! Audio ka ek portion nikal rahe hain. Exactly jaise string slicing hoti hai `text[0:10]`, waise hi audio slicing.

**Line 47:** Chunk file ka naam bana rahe hain. Example: `"meeting.wav_chunk_0.wav"`, `"meeting.wav_chunk_1.wav"`

**Line 48:** Chunk ko WAV file mein export/save kar rahe hain.

**Line 50:** Chunk ka path list mein add kar rahe hain.

```python
    return chunks                                                   # Line 52
```

**Line 52:** Saare chunk file paths ki list return kar rahe hain.

---

### Line 54-65: Main Process Function

```python
def process_input(source: str) -> list:                             # Line 54
```

**Line 54:** **Yeh main function hai jo bahar se call hota hai.** Yeh decide karta hai ki input YouTube URL hai ya local file, aur accordingly process karta hai.

```python
    if source.startswith("http://") or source.startswith("https://"):  # Line 55
        print("Detected YouTube URL. Downloading audio...")             # Line 56
        wav_path = download_youtube_audio(source)                       # Line 57
    else:                                                               # Line 58
        print("Detected local file. Converting to WAV...")              # Line 59
        wav_path = convert_to_wav(source)                               # Line 60
```

**Line 55-57:** Agar source `http://` ya `https://` se start hota hai toh samajh lo YouTube URL hai. Download function call karo.

**Line 58-60:** Warna samajh lo local file hai. Convert function call karo.

Yeh ek **simple heuristic** hai — agar URL hai toh online, warna local file. Production mein aur checks add karte (like URL validation, file existence check, etc.)

```python
    print("Chunking audio...")                                          # Line 62
    chunks = chunk_audio(wav_path)                                      # Line 63
    print(f"Audio ready — {len(chunks)} chunk(s) created.")             # Line 64
    return chunks                                                       # Line 65
```

**Line 62-65:** Audio ko chunks mein todo aur chunk paths return karo.

### Summary: `audio_processor.py` ka Flow

```
process_input("https://youtube.com/watch?v=...")
    │
    ├── URL detected → download_youtube_audio()
    │       └── yt-dlp se audio download → WAV file
    │
    └── chunk_audio(wav_path)
            └── 10-min chunks mein tod do
            └── Return: ["chunk_0.wav", "chunk_1.wav", ...]
```

---

---

# 6. 🎙️ core/transcriber.py — Speech to Text

> **Yeh file audio ko text mein convert karti hai.**
> Do engines support karta hai:
> 1. **Whisper** (OpenAI) — English ke liye, LOCAL mein chalta hai
> 2. **Sarvam AI** — Hinglish ke liye, API call karta hai

---

### Line 1-4: Imports

```python
import whisper                          # Line 1
import os                               # Line 2
import requests                          # Line 3
from pydub import AudioSegment           # Line 4
```

**Line 1:** `whisper` — OpenAI ka Whisper model. Speech-to-text ke liye.

**Line 2:** `os` — Environment variables read karne ke liye (`os.getenv()`).

**Line 3:** `requests` — HTTP requests bhejne ke liye. Sarvam AI ke API ko call karne ke liye use hoga.

**Line 4:** `AudioSegment` — Sarvam ke liye audio ko 25-second pieces mein todne ke liye.

---

### Line 6-16: Constants

```python
# Sarvam's sync STT-translate API rejects audio longer than 30s.
# We slice each chunk into 25s pieces (with a 5s safety margin) before sending.
SARVAM_PIECE_SECONDS = 25                                           # Line 8
```

**Line 6-7:** Comment samjha raha hai — Sarvam AI ka API 30 seconds se zyada audio accept nahi karta. Toh hum 25 seconds ke pieces mein todenge (5 seconds ka safety margin rakh rahe hain).

**Line 8:** `SARVAM_PIECE_SECONDS = 25` — Har piece 25 seconds ka hoga.

```python
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")                 # Line 11
```

**Line 11:** Whisper model ka size environment variable se le rahe hain.
- `os.getenv("WHISPER_MODEL", "small")` — `.env` file se `WHISPER_MODEL` padho, agar nahi mila toh `"small"` use karo.
- Whisper ke models: `tiny`, `base`, `small`, `medium`, `large`
- `tiny` = sabse chhota, fastest, least accurate
- `large` = sabse bada, slowest, most accurate
- `small` = achha balance hai speed aur accuracy ke beech

```python
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")                        # Line 14
SARVAM_STT_TRANSLATE_URL = "https://api.sarvam.ai/speech-to-text-translate"  # Line 15
SARVAM_MODEL = os.getenv("SARVAM_STT_MODEL", "saaras:v2.5")        # Line 16
```

**Line 14:** Sarvam ka API key `.env` se le rahe hain.

**Line 15:** Sarvam ke speech-to-text-translate API ka URL. Yeh API speech ko sunke seedha English mein translate karke text deta hai. Bahut useful hai Hinglish meetings ke liye.

**Line 16:** Sarvam ka model version. Default hai `"saaras:v2.5"`.

```python
_model = None                                                       # Line 18
```

**Line 18:** `_model` — Global variable, initially `None`. Yeh Whisper model ko cache karega. Underscore prefix (`_model`) Python convention hai — "yeh private variable hai, bahar se mat chhedo."

---

### Line 21-29: Whisper Model Loading (Singleton Pattern)

```python
def load_model():                       # Line 21
    global _model                        # Line 23
    if _model is None:                   # Line 25
        print(f"Loading Whisper model: {WHISPER_MODEL} ...")  # Line 26
        _model = whisper.load_model(WHISPER_MODEL)            # Line 27
        print("Whisper model loaded.")                         # Line 28
    return _model                        # Line 29
```

**Line 21:** `load_model()` function — Whisper model load karta hai.

**Line 23:** `global _model` — Yeh bata raha hai ki hum global `_model` variable use kar rahe hain, function ka local nahi.

**Line 25-28:** **Singleton Pattern** implement kar rahe hain!
- Agar `_model` `None` hai (pehli baar call ho raha hai), toh model load karo
- Agar `_model` pehle se loaded hai, toh dubara load mat karo, wahi return karo

**Kyun Singleton Pattern?** 🤔
Whisper model load hone mein time lagta hai (small model ~2-3 seconds, large model ~30+ seconds) aur RAM bhi bahut use hoti hai. Agar har chunk ke liye model dubara load karein toh bahut slow hoga. Singleton pattern se ek baar load hota hai, phir har jagah reuse hota hai.

**Line 27:** `whisper.load_model(WHISPER_MODEL)` — Model download (agar pehli baar hai) aur load kar rahe hain. Pehli baar mein yeh internet se model download karega (~500MB for small), baad mein cache se load hoga.

---

### Line 32-37: Whisper Transcription

```python
def transcribe_chunk_whisper(chunk_path: str) -> str:    # Line 32
    model = load_model()                                  # Line 34
    result = model.transcribe(chunk_path, task="transcribe")  # Line 36
    return result["text"]                                  # Line 37
```

**Line 32:** Function — ek audio chunk ko Whisper se transcribe karta hai.

**Line 34:** Model load karo (ya cached model le lo).

**Line 36:** `model.transcribe(chunk_path, task="transcribe")` — Yeh actual transcription karta hai!
- `chunk_path` — Audio file ka path
- `task="transcribe"` — Task type. Do options hain:
  - `"transcribe"` — Audio ko same language mein text karo
  - `"translate"` — Audio ko English mein translate karke text karo
- Return value ek dictionary hai: `{"text": "...", "segments": [...], "language": "en"}`

**Line 37:** `result["text"]` — Sirf text return kar rahe hain.

---

### Line 40-60: Sarvam AI — Single Piece Send

```python
def _send_to_sarvam(piece_path: str) -> str:                        # Line 40
    """Send one ≤30s WAV file to Sarvam and return the English transcript."""  # Line 41
    headers = {"api-subscription-key": SARVAM_API_KEY}               # Line 42
```

**Line 40:** Private function (underscore prefix `_send_to_sarvam` — convention hai ki yeh internal use ke liye hai).

**Line 42:** HTTP headers mein API key set kar rahe hain. Sarvam API `api-subscription-key` header expect karta hai.

```python
    with open(piece_path, "rb") as f:                                # Line 44
        files = {"file": (os.path.basename(piece_path), f, "audio/wav")}  # Line 45
        data = {"model": SARVAM_MODEL, "with_diarization": "false"}  # Line 46
        response = requests.post(                                     # Line 47
            SARVAM_STT_TRANSLATE_URL,                                 # Line 48
            headers=headers,                                          # Line 49
            files=files,                                              # Line 50
            data=data,                                                # Line 51
            timeout=120,                                              # Line 52
        )                                                             # Line 53
```

**Line 44:** Audio file ko binary mode (`"rb"`) mein open kar rahe hain.

**Line 45:** `files` dictionary bana rahe hain HTTP multipart file upload ke liye:
- `"file"` — API ka expected field name
- Tuple: `(filename, file_object, MIME_type)`
- `os.path.basename(piece_path)` — Sirf filename (bina full path ke)
- `"audio/wav"` — MIME type bata rahe hain ki yeh WAV audio file hai

**Line 46:** `data` — Additional form data:
- `"model"` — Kaunsa Sarvam model use karna hai
- `"with_diarization": "false"` — Speaker diarization nahi chahiye (kon bol raha hai, yeh identify karna). `"false"` string hai, boolean nahi — kyunki form data mein sab strings hoti hain.

**Line 47-53:** `requests.post()` — HTTP POST request bhej rahe hain Sarvam ke API ko.
- `timeout=120` — 120 seconds (2 minutes) ke baad timeout ho jayega. Audio processing slow ho sakta hai.

```python
    if not response.ok:                                               # Line 55
        print(f"\n❌ Sarvam returned {response.status_code}")          # Line 56
        print(f"Response body: {response.text}\n")                     # Line 57
        response.raise_for_status()                                    # Line 58
```

**Line 55-58:** Error handling:
- `response.ok` — `True` agar status code 200-299 ke beech hai
- Agar error aaya toh status code aur response body print karo
- `response.raise_for_status()` — Exception raise karo (e.g., `HTTPError: 400 Bad Request`)

```python
    return response.json().get("transcript", "")                      # Line 60
```

**Line 60:** Response JSON se `"transcript"` field nikal rahe hain. Agar nahi mila toh empty string return karo.

---

### Line 63-89: Sarvam Chunk Transcription (with 25s splitting)

```python
def transcribe_chunk_sarvam(chunk_path: str) -> str:                 # Line 63
    """
    Sarvam sync API only accepts ≤30s audio. We split this chunk into
    25-second pieces, send each separately, and join the transcripts.
    """
    if not SARVAM_API_KEY:                                            # Line 68
        raise RuntimeError("SARVAM_API_KEY is not set in environment / .env")  # Line 69
```

**Line 63:** Function — ek chunk (jo 10 minutes ka ho sakta hai) ko Sarvam se transcribe karta hai.

**Line 68-69:** Pehle check karo ki API key set hai ya nahi. Agar nahi hai toh turant error do — aage badhne ka koi matlab nahi.

```python
    audio = AudioSegment.from_wav(chunk_path)                         # Line 71
    piece_ms = SARVAM_PIECE_SECONDS * 1000                            # Line 72
```

**Line 71:** Audio chunk load kar rahe hain.

**Line 72:** 25 seconds ko milliseconds mein convert: `25 * 1000 = 25000 ms`

```python
    full_text = ""                                                    # Line 74
    total_pieces = (len(audio) + piece_ms - 1) // piece_ms            # Line 75
```

**Line 74:** Empty string — yahan sab pieces ka text join hoga.

**Line 75:** Total pieces calculate kar rahe hain. Yeh **ceiling division** formula hai:
- `(a + b - 1) // b` = `math.ceil(a / b)` ke barabar hai
- Example: Audio 65 seconds ka hai, piece_ms = 25000
  - `(65000 + 25000 - 1) // 25000 = 89999 // 25000 = 3` pieces
  - Piece 1: 0-25s, Piece 2: 25-50s, Piece 3: 50-65s

```python
    for i, start in enumerate(range(0, len(audio), piece_ms)):        # Line 77
        piece = audio[start: start + piece_ms]                        # Line 78
        piece_path = f"{chunk_path}_sv_{i}.wav"                       # Line 79
        piece.export(piece_path, format="wav")                        # Line 80
```

**Line 77-80:** Har 25-second piece ke liye:
1. Audio slice karo
2. Temporary WAV file mein save karo (naam mein `_sv_` = sarvam piece)

```python
        try:                                                          # Line 82
            print(f"  → Sarvam piece {i + 1}/{total_pieces} ...")     # Line 83
            full_text += _send_to_sarvam(piece_path) + " "            # Line 84
        finally:                                                      # Line 85
            if os.path.exists(piece_path):                            # Line 86
                os.remove(piece_path)                                 # Line 87
```

**Line 82-87:** `try...finally` block:
- **try:** Sarvam API ko piece bhejo aur transcript ko `full_text` mein jod do
- **finally:** Chahe success ho ya error, temporary piece file DELETE karo (cleanup!). `finally` block HAMESHA execute hota hai — error aaye ya na aaye.

Kyun cleanup? Kyunki agar 10-minute chunk ke 24 pieces (25s each) hain, toh 24 temporary files ban jayengi. Agar cleanup nahi karein toh disk bhar jayegi.

```python
    return full_text.strip()                                          # Line 89
```

**Line 89:** Saare pieces ka combined text return karo, extra whitespace hata ke.

---

### Line 95-103: Transcription Router

```python
def transcribe_chunk(chunk_path: str, language: str = "english") -> str:  # Line 95
    """
    Route one chunk to Whisper or Sarvam depending on language choice.
    - english  → Whisper (local model)
    - hinglish → Sarvam (translates to English while transcribing)
    """
    if language.lower() == "hinglish":                                # Line 101
        return transcribe_chunk_sarvam(chunk_path)                   # Line 102
    return transcribe_chunk_whisper(chunk_path)                      # Line 103
```

**Line 95:** **Router function** — decide karta hai kaunsa engine use karna hai.

**Line 101-103:** Simple routing:
- `"hinglish"` → Sarvam API (kyunki Whisper Hinglish mein achha nahi hai, Sarvam Indian languages mein specialized hai)
- Kuch bhi aur (default `"english"`) → Whisper (local, fast, free)

**Yeh Strategy Pattern jaisa hai** — same interface, different implementations.

---

### Line 106-123: Transcribe All Chunks

```python
def transcribe_all(chunks: list, language: str = "english") -> str:   # Line 106
    full_transcript = ""                                               # Line 108
    engine = "Sarvam AI" if language.lower() == "hinglish" else "Whisper"  # Line 110
    print(f"Using {engine} for transcription.")                        # Line 111
```

**Line 106:** Main transcription function — saare chunks process karta hai.

**Line 108:** Empty string jisme poora transcript collect hoga.

**Line 110-111:** Kaunsa engine use ho raha hai, woh print karo (logging).

```python
    for i, chunk in enumerate(chunks):                                # Line 113
        print(f"Transcribing chunk {i + 1}/{len(chunks)}...")          # Line 115
        text = transcribe_chunk(chunk, language=language)              # Line 117
        full_transcript += text + " "                                  # Line 119
```

**Line 113-119:** Har chunk ke liye:
1. Progress print karo ("Transcribing chunk 1/3...")
2. Chunk ko transcribe karo
3. Text ko `full_transcript` mein jod do

```python
    print("Transcription complete.")                                   # Line 121
    return full_transcript.strip()                                     # Line 123
```

**Line 121-123:** Complete message print karo aur final transcript return karo.

### Summary: `transcriber.py` ka Flow

```
transcribe_all(["chunk_0.wav", "chunk_1.wav", "chunk_2.wav"], "english")
    │
    ├── For each chunk:
    │   └── transcribe_chunk(chunk, "english")
    │       │
    │       ├── language == "english"
    │       │   └── transcribe_chunk_whisper(chunk)
    │       │       └── Whisper model locally transcribe karega
    │       │
    │       └── language == "hinglish"
    │           └── transcribe_chunk_sarvam(chunk)
    │               └── 25s pieces mein tod ke Sarvam API ko bhejega
    │
    └── Return: "Full transcript text of the entire video..."
```

---

---

# 7. 📋 core/summarizer.py — Summarization & Title Generation

> **Yeh file transcript ka summary aur meeting ka title generate karti hai.**
> LangChain + Mistral AI use karti hai.
> **Map-Reduce pattern** use karta hai summarization ke liye.

---

### Line 1-7: Imports

```python
from langchain_mistralai import ChatMistralAI                       # Line 1
from langchain_core.prompts import ChatPromptTemplate                # Line 2
from langchain_core.output_parsers import StrOutputParser            # Line 3
from langchain_text_splitters import RecursiveCharacterTextSplitter  # Line 4
from langchain_core.runnables import RunnablePassthrough, RunnableLambda  # Line 5
import os                                                            # Line 7
```

**Line 1:** `ChatMistralAI` — Mistral AI ka chat model. Yeh LLM hai jo text samajhta hai aur generate karta hai.

**Line 2:** `ChatPromptTemplate` — Prompt template banane ke liye. Socho prompt template aise — jaise ek form hai jisme blanks hain jo runtime pe fill hoti hain.

**Line 3:** `StrOutputParser` — LLM ka output ek complex object hota hai (`AIMessage`). Yeh parser uss object se sirf text string nikal deta hai.

**Line 4:** `RecursiveCharacterTextSplitter` — Bade text ko chhote chunks mein todne ke liye. "Recursive" kyun? Kyunki yeh multiple separators try karta hai (`\n\n`, `\n`, ` `, `""`) — pehle paragraphs pe todne ki koshish karta hai, phir sentences pe, phir words pe.

**Line 5:** 
- `RunnablePassthrough` — Input ko as-is pass karta hai (identity function jaisa).
- `RunnableLambda` — Koi bhi Python function ko LangChain runnable mein convert karta hai.

Yeh dono LangChain ke **LCEL (LangChain Expression Language)** ka part hain. LCEL ek declarative way hai chains banana ke liye using the `|` (pipe) operator.

---

### Line 9-10: LLM Factory Function

```python
def get_llm():                                                       # Line 9
    return ChatMistralAI(
        model="mistral-small-latest", 
        mistral_api_key=os.getenv("MISTRAL_API_KEY"),
        temperature=0.3
    )                                                                 # Line 10
```

**Line 9-10:** Har baar fresh LLM instance bana ke return karta hai.

- `model="mistral-small-latest"` — Mistral ka `small` model use kar rahe hain. Mistral ke models:
  - `mistral-tiny` — Sabse chhota, fastest, cheapest
  - `mistral-small` — Achha balance
  - `mistral-medium` — Better quality
  - `mistral-large` — Best quality, sabse expensive
  - `"latest"` suffix matlab latest version

- `mistral_api_key=os.getenv("MISTRAL_API_KEY")` — API key `.env` se le rahe hain.

- `temperature=0.3` — **Temperature** LLM ka "creativity dial" hai:
  - `0.0` = Deterministic, hamesha same answer dega. Conservative.
  - `0.3` = Thoda creative, par mostly factual (summarization ke liye best)
  - `0.7` = Zyada creative
  - `1.0` = Bahut random/creative (poetry, stories ke liye)
  - Summary ke liye low temperature chahiye kyunki hum facts chahte hain, creativity nahi.

---

### Line 13-19: Transcript Splitting

```python
def split_transcript(transcript: str) -> list:                       # Line 13
    splitter = RecursiveCharacterTextSplitter(                       # Line 14
        chunk_size=3000,                                             # Line 15
        chunk_overlap=200                                            # Line 16
    )                                                                # Line 17
    return splitter.split_text(transcript)                           # Line 19
```

**Line 13:** Function — bade transcript ko chhote pieces mein todta hai LLM ke liye.

**Line 14-17:** Splitter configure kar rahe hain:
- `chunk_size=3000` — Har chunk maximum 3000 characters ka hoga
- `chunk_overlap=200` — Har do consecutive chunks mein 200 characters overlap honge

**Chunk overlap kyun chahiye?** 🤔

Socho transcript aise hai: "...Rahul said we should deploy by Friday. On Friday, the team..."

Agar overlap nahi hai:
- Chunk 1: "...Rahul said we should deploy by Fri"
- Chunk 2: "day. On Friday, the team..."

Sentence toot gaya! Context lost ho gaya!

Overlap ke saath:
- Chunk 1: "...Rahul said we should deploy by Friday. On Friday"
- Chunk 2: "deploy by Friday. On Friday, the team..."

Ab dono chunks mein "deploy by Friday" hai, toh context preserve ho gaya.

**Line 19:** `splitter.split_text(transcript)` — Actual splitting. List of strings return karta hai.

---

### Line 21-54: Summarization Function (Map-Reduce Pattern)

```python
def summarize(transcript: str) -> str:                               # Line 21
    llm = get_llm()                                                  # Line 22
```

**Line 21-22:** Main summarization function. LLM instance le rahe hain.

#### Phase 1: MAP — Har Chunk Ka Individual Summary

```python
    map_prompt = ChatPromptTemplate.from_messages([                  # Line 24
        ("system", "Summarize this portion of a meeting transcript concisely."),  # Line 26
        ("human", "{text}"),                                         # Line 27
    ])                                                               # Line 28-29
```

**Line 24-29:** **Map Prompt** bana rahe hain.
- `("system", "...")` — System message. Yeh LLM ko role deta hai — "tu ek summarizer hai"
- `("human", "{text}")` — Human message mein `{text}` placeholder hai. Runtime pe actual chunk text aa jayega.

ChatPromptTemplate **chat messages** ka template hai. LLMs ko messages list chahiye (system + human), raw text nahi.

```python
    map_chain = map_prompt | llm | StrOutputParser()                 # Line 31
```

**Line 31:** 🔥 **LCEL Chain bana rahe hain!** Yeh project ka core concept hai.

`|` (pipe) operator se chain ban raha hai:
```
map_prompt → llm → StrOutputParser
```

Matlab:
1. **Prompt** template mein `{text}` fill karo
2. **LLM** ko bhejo — Mistral AI summary generate karega
3. **StrOutputParser** — LLM ke output se sirf text string nikalo

Socho isse aise jaise factory ki assembly line:
```
Raw material (text) → Machine 1 (prompt) → Machine 2 (LLM) → Machine 3 (parser) → Final product (summary string)
```

```python
    chunks = split_transcript(transcript)                            # Line 33
    chunk_summaries = [map_chain.invoke({"text": chunk}) for chunk in chunks]  # Line 35
    combined = "\n\n".join(chunk_summaries)                          # Line 37
```

**Line 33:** Transcript ko chunks mein tod rahe hain.

**Line 35:** **Map Phase!** Har chunk ke liye independently summary generate kar rahe hain.
- `map_chain.invoke({"text": chunk})` — Chain ko invoke (execute) kar rahe hain
- `{"text": chunk}` — Prompt template mein `{text}` placeholder ki jagah actual chunk text aa jayega
- List comprehension se saare chunks ke summaries ek list mein collect ho jayenge

**Line 37:** Saare chunk summaries ko `\n\n` (double newline) se join kar rahe hain ek combined text mein.

#### Phase 2: REDUCE — Combined Summary

```python
    combined_prompt = ChatPromptTemplate.from_messages([             # Line 39
        (                                                            # Line 41
            "system",
            "You are an expert meeting summarizer. Combine these partial summaries "
            "into one final professional meeting summary in bullet points.",
        ),                                                           # Line 45
        ("human", "{text}"),                                         # Line 46
    ])                                                               # Line 47-48
```

**Line 39-48:** **Reduce Prompt** — Ab saare partial summaries ko ek final summary mein combine karna hai.
- System message bata raha hai: "Expert meeting summarizer ban ke bullet points mein final summary bana"

```python
    combined_chain = (                                               # Line 50
        RunnablePassthrough() 
        | RunnableLambda(lambda x: {"text": x}) 
        | combined_prompt 
        | llm 
        | StrOutputParser()
    )                                                                # Line 52
```

**Line 50-52:** 🔥 **Reduce Chain!**

Yeh thoda complex hai. Step by step samjhte hain:

1. `RunnablePassthrough()` — Input ko as-is aage pass karo. Yahan `combined` string aa rahi hai.

2. `RunnableLambda(lambda x: {"text": x})` — String ko dictionary mein convert karo.
   - Input: `"Summary of chunk 1\n\nSummary of chunk 2"`
   - Output: `{"text": "Summary of chunk 1\n\nSummary of chunk 2"}`
   - Kyun? Kyunki `ChatPromptTemplate` ko dictionary chahiye jisme `{text}` key ho.

3. `combined_prompt` — Template mein `{text}` fill karo

4. `llm` — Mistral ko bhejo — final combined summary generate hoga

5. `StrOutputParser()` — Clean string output lo

```python
    return combined_chain.invoke(combined)                           # Line 54
```

**Line 54:** Chain execute karo `combined` text pe aur final summary return karo.

### Map-Reduce Pattern Visual

```
Transcript (bahut bada text)
     │
     ├── Chunk 1 ──→ LLM ──→ Summary 1 ──┐
     ├── Chunk 2 ──→ LLM ──→ Summary 2 ──┤
     ├── Chunk 3 ──→ LLM ──→ Summary 3 ──┤  MAP PHASE
     └── Chunk 4 ──→ LLM ──→ Summary 4 ──┘
                                           │
                                    Combined Text
                                           │
                                      LLM ──→ Final Summary    REDUCE PHASE
```

**Kyun Map-Reduce?** 🤔
LLMs ki token limit hoti hai. Mistral-small ki limit ~32K tokens hai. Agar transcript bahut bada hai (1 hour meeting = ~10K+ words), toh directly LLM mein nahi daal sakte. Toh pehle chhote-chhote chunks ka summary lo (MAP), phir un summaries ko combine karo (REDUCE).

---

### Line 56-75: Title Generation

```python
def generate_title(transcipt: str) -> str:                          # Line 56
    llm = get_llm()                                                 # Line 57
```

**Line 56:** Title generate karne ka function. (Note: `transcipt` mein typo hai — hona chahiye `transcript`, but it works.)

```python
    title_chain = (                                                  # Line 61
        RunnablePassthrough() 
        | RunnableLambda(lambda x: {"text": x}) 
        | ChatPromptTemplate.from_messages([
            (
                "system",
                "Based on the meeting transcript, generate a short professional meeting title "
                "(max 8 words). Only return the title, nothing else.",
            ),
            ("human", "{text}"),
        ])
        | llm
        | StrOutputParser()
    )                                                                # Line 73
```

**Line 61-73:** Title chain — same pattern:
1. `RunnablePassthrough()` — Text as-is pass karo
2. `RunnableLambda(lambda x: {"text": x})` — Dictionary mein wrap karo
3. `ChatPromptTemplate` — Prompt: "Max 8 words ka professional title de, sirf title, kuch aur nahi"
4. `llm` — Mistral generate karega
5. `StrOutputParser()` — String output

```python
    return title_chain.invoke(transcipt[:2000])                      # Line 75
```

**Line 75:** `transcipt[:2000]` — Sirf pehle 2000 characters bhej rahe hain. Kyun? Title ke liye poora transcript bhejne ki zarurat nahi. Pehle 2000 characters se hi pata chal jayega meeting kis baare mein hai. Isse API cost bhi kam hoti hai aur speed bhi badhti hai.

---

---

# 8. 🔍 core/extractor.py — Action Items, Decisions, Questions

> **Yeh file meeting transcript se 3 cheezein extract karti hai:**
> 1. **Action Items** — Kya karna hai, kisko karna hai, kab tak
> 2. **Key Decisions** — Kya decisions liye gaye
> 3. **Open Questions** — Kaunse sawaal abhi resolve nahi hue

---

### Line 1-7: Imports

```python
#Actionableitems , decision , questions                              # Line 1

from langchain_mistralai import ChatMistralAI                       # Line 3
from langchain_core.prompts import ChatPromptTemplate                # Line 4
from langchain_core.output_parsers import StrOutputParser            # Line 5
from langchain_core.runnables import RunnablePassthrough, RunnableLambda  # Line 6
import os                                                            # Line 7
```

Sab imports same hain jaise `summarizer.py` mein. LangChain + Mistral ka setup.

---

### Line 10-11: LLM Factory

```python
def get_llm():                                                       # Line 10
    return ChatMistralAI(
        model="mistral-small-latest", 
        mistral_api_key=os.getenv("MISTRAL_API_KEY"),
        temperature=0.2
    )                                                                 # Line 11
```

**Line 10-11:** Same LLM factory, but `temperature=0.2` — summarizer mein 0.3 tha. Yahan 0.2 kyun? Kyunki extraction mein aur bhi zyada precision chahiye. Hum exactly wahi chahte hain jo meeting mein bola gaya, koi creative interpretation nahi.

---

### Line 15-22: Generic Chain Builder

```python
def build_chain(system_prompt: str):                                 # Line 15
    llm = get_llm()                                                  # Line 16
    return (                                                         # Line 17
        RunnablePassthrough() 
        | RunnableLambda(lambda x: {"text": x}) 
        | ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{text}"),
        ]) 
        | llm 
        | StrOutputParser()
    )                                                                # Line 22
```

**Line 15-22:** 🔥 **Generic chain builder!** Yeh smart design hai.

Notice karo — chain pattern har jagah same hai (summarizer mein bhi same tha). Toh is function ne common pattern ko extract kar liya. Ab tum bas different `system_prompt` do, aur tumhe complete chain mil jayega.

**Yeh DRY principle hai — Don't Repeat Yourself.** Code duplication avoid kar rahe hain.

Chain ka flow:
```
Input (transcript string)
  → RunnablePassthrough (as-is pass)
  → RunnableLambda (string → {"text": string})
  → ChatPromptTemplate (prompt fill karo)
  → LLM (Mistral process karega)
  → StrOutputParser (clean string output)
```

---

### Line 24-34: Extract Action Items

```python
def extract_action_items(transcript: str) -> str:                    # Line 24
    chain = build_chain(                                             # Line 25
        "You are an expert meeting analyst. From the meeting transcript, "
        "extract all action items. For each provide:\n"
        "- Task description\n"
        "- Owner (who is responsible)\n"
        "- Deadline (if mentioned, else write 'Not specified')\n\n"
        "Format as a numbered list. If none found say 'No action items found.'"
    )                                                                # Line 32
    return chain.invoke(transcript)                                  # Line 34
```

**Line 24-34:** Action items extract karne ka function.

System prompt bahut specific hai:
- **Expert meeting analyst** bano
- **Action items** nikalo
- Har item mein batao:
  - **Task description** — Kya karna hai
  - **Owner** — Kisko karna hai
  - **Deadline** — Kab tak (agar mention nahi hai toh "Not specified")
- **Numbered list** mein format karo
- Agar koi action item nahi mila toh "No action items found." bolo

**Line 34:** Chain invoke karo poore transcript pe aur result return karo.

---

### Line 37-43: Extract Key Decisions

```python
def extract_key_decisions(transcript: str) -> str:                   # Line 37
    chain = build_chain(                                             # Line 38
        "You are an expert meeting analyst. From the meeting transcript, "
        "extract all key decisions made. Format as a numbered list. "
        "If none found say 'No key decisions found.'"
    )                                                                # Line 42
    return chain.invoke(transcript)                                  # Line 43
```

**Line 37-43:** Key decisions extract karne ka function. Same pattern, different prompt.

---

### Line 46-52: Extract Open Questions

```python
def extract_questions(transcript: str) -> str:                       # Line 46
    chain = build_chain(                                             # Line 47
        "From the meeting transcript, extract all unresolved questions "
        "or topics needing follow-up. Format as a numbered list. "
        "If none found say 'No open questions found.'"
    )                                                                # Line 50
    return chain.invoke(transcript)                                  # Line 52
```

**Line 46-52:** Open/unresolved questions extract karne ka function. Same pattern.

### Notice karo kitna clean hai!

`build_chain()` function ki wajah se teeno extraction functions sirf 5-6 lines ke hain. Agar `build_chain()` nahi hota toh teeno mein same boilerplate code repeat hota. **This is good software design.**

---

---

# 9. 🗃️ core/vector_store.py — ChromaDB Vector Store

> **Yeh file transcript ko vector database (ChromaDB) mein store karti hai.**
> RAG (Retrieval Augmented Generation) ke liye yeh zaroori hai.
> Yeh text ko embeddings mein convert karke searchable banati hai.

---

### Pehle samjho: Vector Store kya hai?

Normal database mein tum `SELECT * FROM table WHERE text LIKE '%meeting%'` karte ho — exact keyword match.

Vector store mein:
1. Text ko **embeddings** (mathematical vectors) mein convert karte ho
2. Similar meaning wale texts ke vectors ek dusre ke paas hote hain
3. Search karte waqt question ki bhi embedding banate ho, phir nearest vectors dhundhte ho

Example:
```
"What were the budget decisions?" 
   ↓ (embedding)
[0.23, 0.87, -0.12, 0.45, ...]  ← Question ka vector

Stored vectors:
"The team decided to allocate $50K for marketing" → [0.25, 0.85, -0.10, 0.43, ...]  ← CLOSE! (similar meaning)
"We discussed the weather today"                  → [0.91, -0.34, 0.67, 0.11, ...]  ← FAR (different meaning)
```

Nearest vector match hoga → relevant text chunk mil jayega.

---

### Line 1-5: Imports

```python
import os                                                            # Line 1
from langchain_chroma import Chroma                                  # Line 2
from langchain_community.embeddings import HuggingFaceEmbeddings     # Line 3
from langchain_text_splitters import RecursiveCharacterTextSplitter   # Line 4
from langchain_core.documents import Document                        # Line 5
```

**Line 2:** `Chroma` — LangChain ka ChromaDB wrapper. ChromaDB ek vector database hai jo locally chalta hai.

**Line 3:** `HuggingFaceEmbeddings` — HuggingFace ke embedding models use karne ke liye. Yeh text ko vectors mein convert karta hai.

**Line 4:** `RecursiveCharacterTextSplitter` — Text ko chunks mein todne ke liye (same as summarizer mein).

**Line 5:** `Document` — LangChain ka Document class. Har chunk ko ek "Document" object mein wrap karte hain (text + metadata).

---

### Line 7-9: Constants

```python
CHROMA_DIR = "vector_db"                                             # Line 7
COLLECTION_NAME = "meeting_transcript"                               # Line 8
EMBEDDING_MODEL = "all-MiniLM-L6-v2"                                # Line 9
```

**Line 7:** `CHROMA_DIR` — ChromaDB ka data yahan store hoga (local folder).

**Line 8:** `COLLECTION_NAME` — ChromaDB mein ek collection ka naam. Collection = table jaisa concept. Saare meeting transcript vectors is collection mein store honge.

**Line 9:** `EMBEDDING_MODEL` — `"all-MiniLM-L6-v2"` — Yeh ek popular sentence-transformers model hai:
- **MiniLM** — Microsoft ka mini language model
- **L6** — 6 layers (chhota model, fast)
- **v2** — Version 2
- Output: 384-dimensional vector

Kyun yeh model? Kyunki yeh:
- Fast hai (6 layers only)
- Accurate hai (semantic similarity ke liye trained)
- Small hai (~80MB)
- Free hai (HuggingFace pe available)

---

### Line 11-15: Embeddings Factory

```python
def get_embeddings():                                                # Line 11
    return HuggingFaceEmbeddings(                                   # Line 12
        model_name=EMBEDDING_MODEL,                                 # Line 13
        model_kwargs={"device": "cpu"}                              # Line 14
    )                                                                # Line 15
```

**Line 11-15:** Embedding model instance bana ke return karta hai.
- `model_name=EMBEDDING_MODEL` — `"all-MiniLM-L6-v2"` model use karo
- `model_kwargs={"device": "cpu"}` — CPU pe chalo. Agar GPU hota toh `"cuda"` likh sakte the for faster processing.

---

### Line 17-39: Build Vector Store

```python
def build_vector_store(transcript: str) -> Chroma:                   # Line 17
    print("Building vector Store")                                   # Line 18
```

**Line 17:** Main function — transcript leke vector store banata hai.

```python
    splitter = RecursiveCharacterTextSplitter(                       # Line 20
        chunk_size=500,                                              # Line 21
        chunk_overlap=50                                             # Line 22
    )                                                                # Line 23
    chunks = splitter.split_text(transcript)                         # Line 24
```

**Line 20-24:** Transcript ko 500 character ke chunks mein tod rahe hain, 50 characters overlap ke saath.

**Note:** Yahan chunk_size 500 hai, summarizer mein 3000 tha. Kyun?
- **Summarizer (3000):** LLM ko zyada context chahiye summary banane ke liye
- **Vector store (500):** RAG mein chhote chunks better results dete hain — zyada precise retrieval hoti hai. Agar chunk bahut bada hai toh irrelevant text bhi aa jayega search results mein.

```python
    docs = [                                                         # Line 26
        Document(page_content=chunk, metadata={'chunk_index': i})    # Line 27
        for i, chunk in enumerate(chunks)                            # Line 28
    ]                                                                # Line 29
```

**Line 26-29:** Har text chunk ko `Document` object mein wrap kar rahe hain.
- `page_content=chunk` — Actual text
- `metadata={'chunk_index': i}` — Metadata mein chunk ka index store kar rahe hain (0, 1, 2, ...)
- Metadata useful hota hai later — pata chal sakta hai ki answer transcript ke kaunse hisse se aaya

```python
    embeddings = get_embeddings()                                    # Line 31
    vector_store = Chroma.from_documents(                           # Line 32
        documents=docs,                                              # Line 33
        embedding=embeddings,                                        # Line 34
        collection_name=COLLECTION_NAME,                             # Line 35
        persist_directory=CHROMA_DIR                                 # Line 36
    )                                                                # Line 37
    return vector_store                                              # Line 39
```

**Line 31-39:** Vector store bana rahe hain.

`Chroma.from_documents()` kya karta hai:
1. Har document ka `page_content` leta hai
2. Embedding model se vector generate karta hai (384-dimensional)
3. Vector + text + metadata ko ChromaDB mein store karta hai
4. `persist_directory=CHROMA_DIR` — Disk pe save karta hai (restart ke baad bhi data rahega)

Visual:
```
Document 0: "Rahul said we need to deploy by Friday..."
   → Embedding: [0.12, -0.45, 0.78, ..., 0.23]  (384 numbers)
   → Stored in ChromaDB

Document 1: "The marketing budget was approved at 50K..."
   → Embedding: [0.56, 0.11, -0.34, ..., 0.89]  (384 numbers)
   → Stored in ChromaDB

... and so on for all chunks
```

---

### Line 43-51: Load Existing Vector Store

```python
def load_vector_store() -> Chroma:                                   # Line 43
    embeddings = get_embeddings()                                    # Line 44
    vector_store = Chroma(                                           # Line 45
        collection_name=COLLECTION_NAME,                             # Line 46
        embedding_function=embeddings,                               # Line 47
        persist_directory=CHROMA_DIR                                 # Line 48
    )                                                                # Line 49
    return vector_store                                              # Line 51
```

**Line 43-51:** Pehle se saved vector store ko load karta hai. Yeh `from_documents` nahi call karta — sirf existing data load karta hai.

Useful hai jab tum restart ke baad dubara vector store access karna chaho bina transcription dubara kiye.

---

### Line 53-57: Retriever Factory

```python
def get_retriever(vector_store: Chroma, k: int = 4):                # Line 53
    return vector_store.as_retriever(                                # Line 54
        search_type='similarity',                                    # Line 55
        search_kwargs={"k": k}                                      # Line 56
    )                                                                # Line 57
```

**Line 53-57:** Vector store se **retriever** banata hai.

**Retriever kya hai?** — Jab tum question puchho, retriever vector store mein search karke top-k relevant documents laata hai.

- `search_type='similarity'` — **Cosine similarity** based search. Jinka vector question ke vector ke sabse close hoga, woh return honge.
- `search_kwargs={"k": k}` — Top `k` results return karo. Default 4 hai — toh 4 sabse relevant chunks milenge.

**Kyun 4?** — Bahut kam (1-2) toh context miss ho sakta hai. Bahut zyada (10-20) toh irrelevant text bhi aa jayega aur LLM confuse ho jayega. 4 ek achha balance hai.

---

---

# 10. 🧠 core/rag_engine.py — RAG (Retrieval Augmented Generation)

> **Yeh file RAG pipeline banati hai.**
> RAG ka matlab hai: Pehle relevant context RETRIEVE karo, phir LLM se GENERATE karo.
> Isse tum apni meeting se CHAT kar sakte ho!

---

### RAG Kya Hai? — Deep Dive

**Problem:** LLMs ko tumhari meeting ke baare mein kuch nahi pata. Agar tum directly Mistral se pucho "Rahul ne kya bola?", toh woh nahi bata payega kyunki uske training data mein tumhari meeting nahi hai.

**Solution: RAG (Retrieval Augmented Generation)**
1. **Retrieve:** Question ke relevant transcript chunks dhundho (vector store se)
2. **Augment:** Un chunks ko LLM ke prompt mein add karo (context ke taur pe)
3. **Generate:** LLM ab context ke basis pe answer generate karega

```
Question: "What did Rahul say about the deadline?"
    │
    ├── Step 1: RETRIEVE
    │   Vector store search → Top 4 relevant chunks:
    │   - "Rahul mentioned we need to deploy by Friday..."
    │   - "The deadline discussion ended with Friday being final..."
    │   - "Rahul also suggested testing on Thursday..."
    │   - "The team agreed with Rahul's timeline..."
    │
    ├── Step 2: AUGMENT
    │   Prompt: "Based on this context: [chunks above], answer: What did Rahul say about the deadline?"
    │
    └── Step 3: GENERATE
        LLM Answer: "Rahul said the deployment deadline is Friday, 
                      and suggested testing should happen on Thursday."
```

---

### Line 1-6: Imports

```python
import os                                                            # Line 1
from langchain_mistralai import ChatMistralAI                       # Line 2
from langchain_core.prompts import ChatPromptTemplate                # Line 3
from langchain_core.output_parsers import StrOutputParser            # Line 4
from langchain_core.runnables import RunnablePassthrough, RunnableLambda  # Line 5
from core.vector_store import build_vector_store, load_vector_store, get_retriever  # Line 6
```

**Line 6:** `vector_store` module se functions import kar rahe hain. Yeh dependency chain hai:
- `rag_engine.py` depends on → `vector_store.py`

---

### Line 8-13: LLM Factory

```python
def get_llm():                                                       # Line 8
    return ChatMistralAI(                                            # Line 9
        model="mistral-small-latest",                                # Line 10
        mistral_api_key=os.getenv("MISTRAL_API_KEY"),                # Line 11
        temperature=0.3,                                             # Line 12
    )                                                                # Line 13
```

Same LLM factory, temperature 0.3.

---

### Line 15-16: Document Formatter

```python
def format_docs(docs):                                               # Line 15
    return "\n\n".join([doc.page_content for doc in docs])            # Line 16
```

**Line 15-16:** Retrieved documents ko ek string mein format karta hai.

- `docs` — List of `Document` objects (retriever se aayenge)
- `doc.page_content` — Har document ka text
- `"\n\n".join(...)` — Saare texts ko double newline se join kar do

Example:
```
Input: [Document("Chunk 1 text"), Document("Chunk 2 text")]
Output: "Chunk 1 text\n\nChunk 2 text"
```

---

### Line 18-55: Build RAG Chain

```python
def build_rag_chain(transcript: str):                                # Line 18
    vector_store = build_vector_store(transcript)                    # Line 20
    retriever = get_retriever(vector_store, k=4)                     # Line 22
    llm = get_llm()                                                  # Line 24
```

**Line 18:** Main function — transcript se poora RAG chain banata hai.

**Line 20:** Vector store banao (transcript → chunks → embeddings → ChromaDB).

**Line 22:** Retriever banao — top 4 similar chunks dhundhega.

**Line 24:** LLM instance lo.

```python
    prompt = ChatPromptTemplate.from_messages([                      # Line 26
        (                                                            # Line 28
            "system",
            """You are an expert meeting assistant. Answer the user's question 
based ONLY on the meeting transcript context provided below.

If the answer is not found in the context, say: 
"I could not find this information in the meeting transcript."

Always be concise and precise. If quoting someone, mention it clearly.

Context from meeting transcript:
{context}""",
        ),                                                           # Line 39-40
        ("human", "{question}"),                                     # Line 41
    ])                                                               # Line 42-43
```

**Line 26-43:** RAG Prompt — Do placeholders hain:
1. `{context}` — Retrieved chunks yahan aayenge
2. `{question}` — User ka question yahan aayega

Prompt ki instructions:
- **ONLY context ke basis pe answer do** — Hallucination mat karo (apne se mat banao)
- **Agar answer nahi mila** toh honestly bol do "I could not find this information"
- **Concise aur precise** raho
- **Quote** kar rahe ho toh clearly mention karo

Yeh prompt bahut important hai! Agar yeh sahi se nahi likha toh:
- LLM apne se answer bana lega (hallucination)
- Ya bahut lamba answer dega
- Ya irrelevant baatein karega

```python
    #full LCEL Rag pipeline                                          # Line 45

    rag_chain = (                                                    # Line 47
        {
            "context": retriever | RunnableLambda(format_docs),      # Line 49
            "question": RunnablePassthrough()                        # Line 50
        }
        | prompt | llm | StrOutputParser()                           # Line 52
    )                                                                # Line 53
```

**Line 47-53:** 🔥🔥🔥 **YEH POORE PROJECT KA SABSE IMPORTANT PIECE HAI — LCEL RAG CHAIN!**

Yeh samajhna thoda tricky hai lekin bahut powerful hai. Step by step:

#### Input kya hai?
User ka question string, e.g., `"What did Rahul say about the deadline?"`

#### Step 1: Parallel Dictionary
```python
{
    "context": retriever | RunnableLambda(format_docs),
    "question": RunnablePassthrough()
}
```

Yeh ek **RunnableParallel** hai. Dictionary mein do keys hain, dono PARALLEL mein execute honge:

**"context" branch:**
1. `retriever` — User ka question lega, vector store mein search karega, top 4 relevant Document objects return karega
2. `RunnableLambda(format_docs)` — Un 4 Documents ko ek string mein join karega

**"question" branch:**
1. `RunnablePassthrough()` — User ka original question as-is pass karega

**Output of this step:**
```python
{
    "context": "Relevant chunk 1 text\n\nRelevant chunk 2 text\n\n...",
    "question": "What did Rahul say about the deadline?"
}
```

#### Step 2: Prompt
`prompt` — Dictionary ki keys (`context`, `question`) prompt template mein fill ho jayengi.

#### Step 3: LLM
`llm` — Mistral AI answer generate karega.

#### Step 4: Parser
`StrOutputParser()` — Clean string answer.

**Visual Flow:**
```
"What did Rahul say?" (input)
         │
    ┌────┴─────────────────┐
    │                      │
    ↓                      ↓
 retriever           RunnablePassthrough
    │                      │
    ↓                      │
 [Doc1, Doc2,              │
  Doc3, Doc4]              │
    │                      │
    ↓                      │
 format_docs               │
    │                      │
    ↓                      ↓
{"context": "...",    "question": "What did Rahul say?"}
         │
         ↓
      prompt (fill {context} and {question})
         │
         ↓
       LLM (Mistral generates answer)
         │
         ↓
    StrOutputParser
         │
         ↓
  "Rahul said the deadline is Friday and testing should be on Thursday."
```

```python
    return rag_chain                                                 # Line 55
```

**Line 55:** Built chain return karo.

---

### Line 58-90: Load RAG Chain (from disk)

```python
def load_rag_chain():                                                # Line 58
    vector_store = load_vector_store()                               # Line 59
    retriver = get_retriever()                                       # Line 60
    # ... (same chain building as above)
```

**Line 58-90:** Same chain banana, but `load_vector_store()` se pehle se saved vector store load karna. Useful jab restart ke baad dubara use karna ho.

Note: Line 60 mein typo hai — `retriver` hona chahiye `retriever`. Aur `get_retriever()` ko `vector_store` argument chahiye but yahan nahi diya — yeh ek bug hai. Lekin `build_rag_chain()` primary function hai jo use hota hai, toh issue nahi aata.

---

### Line 93-97: Ask Question

```python
def ask_question(rag_chain, question: str) -> str:                   # Line 93
    print(f"Question : {question}")                                  # Line 94
    answer = rag_chain.invoke(question)                              # Line 95
    print(f"answer :{answer}")                                       # Line 96
    return answer                                                    # Line 97
```

**Line 93-97:** Simple wrapper — question puchho, answer lo.
- `rag_chain.invoke(question)` — Poora RAG pipeline execute hoga (retrieve → augment → generate)
- Logging bhi ho rahi hai (`print`)

---

---

# 11. 🖥️ main.py — CLI Entry Point

> **Yeh file project ko command line se chalane ke liye hai.**
> Terminal mein `python main.py` run karo aur interactive mode mein use karo.

---

### Line 1-9: Imports & Setup

```python
from dotenv import load_dotenv                                       # Line 1
from utils.audio_processor import process_input                      # Line 2
from core.transcriber import transcribe_all                          # Line 3
from core.summarizer import summarize, generate_title                # Line 4
from core.extractor import extract_action_items, extract_key_decisions, extract_questions  # Line 5
from core.rag_engine import build_rag_chain, ask_question            # Line 6

load_dotenv()                                                        # Line 9
```

**Line 1:** `load_dotenv` import karo — yeh `.env` file se environment variables load karega.

**Line 2-6:** Saare modules se functions import kar rahe hain:
- `process_input` — Audio download + chunking
- `transcribe_all` — Speech to text
- `summarize`, `generate_title` — Summary aur title
- `extract_action_items`, `extract_key_decisions`, `extract_questions` — Extraction
- `build_rag_chain`, `ask_question` — RAG chat

**Line 9:** `load_dotenv()` — `.env` file se API keys load karo. **Yeh sabse pehle hona chahiye** (before any core imports that use env vars). Agar yeh nahi call karte toh `MISTRAL_API_KEY`, `SARVAM_API_KEY` etc. `None` honge.

---

### Line 11-38: Pipeline Function

```python
def run_pipeline(source: str, language: str = "english") -> dict:    # Line 11
    print("starting AI Video Assistant")                             # Line 12
```

**Line 11:** Main pipeline function. Source (URL/path) aur language leta hai, aur ek dictionary return karta hai jisme saari processed information hoti hai.

```python
    chunks = process_input(source)                                   # Line 14
```

**Line 14:** **Step 1:** Audio download + chunking. YouTube URL ho ya local file, yeh handle kar lega.

```python
    transcript = transcribe_all(chunks, language)                    # Line 16
    print(f"raw transcription (first 300 characters ) {transcript[:300]}")  # Line 17
```

**Line 16:** **Step 2:** Saare chunks ko transcribe karo.

**Line 17:** Debug logging — pehle 300 characters print kar rahe hain taaki pata chale transcription sahi hua ya nahi.

```python
    title = generate_title(transcript)                               # Line 19
    summary = summarize(transcript)                                  # Line 21
```

**Line 19:** **Step 3:** Title generate karo.

**Line 21:** **Step 4:** Summary generate karo.

```python
    action_item = extract_action_items(transcript)                   # Line 23
    decisions = extract_key_decisions(transcript)                    # Line 25
    questions = extract_questions(transcript)                        # Line 26
```

**Line 23-26:** **Step 5:** Extraction — action items, decisions, questions.

```python
    rag_chain = build_rag_chain(transcript)                          # Line 28
```

**Line 28:** **Step 6:** RAG chain banao — transcript ko vector store mein daalo aur chat chain ready karo.

```python
    return {                                                         # Line 30
        "title": title,                                              # Line 31
        "transcript": transcript,                                    # Line 32
        "summary": summary,                                          # Line 33
        "action_items": action_item,                                 # Line 34
        "key_decisions": decisions,                                  # Line 35
        "open_questions": questions,                                 # Line 36
        "rag_chain": rag_chain,                                      # Line 37
    }                                                                # Line 38
```

**Line 30-38:** Saari processed information ek dictionary mein return kar rahe hain. Yeh dictionary `app.py` (Streamlit) aur CLI dono use karte hain.

---

### Line 40-65: CLI Entry Point

```python
if __name__ == "__main__":                                           # Line 40
```

**Line 40:** **Python ka classic pattern.** Agar yeh file directly run ho rahi hai (`python main.py`), toh yeh block execute hoga. Agar koi doosri file isse import karti hai, toh nahi hoga.

```python
    source = input("Enter YouTube URL or local file path: ").strip()  # Line 42
    language = input("Language (english/hinglish): ").strip() or "english"  # Line 43
    result = run_pipeline(source, language)                          # Line 44
```

**Line 42:** User se YouTube URL ya file path lo.

**Line 43:** Language puchho. `or "english"` — agar user kuch nahi type karta (empty string), toh default `"english"` use karo. Yeh Python ka truthy/falsy concept hai — empty string falsy hoti hai.

**Line 44:** Pipeline run karo.

```python
    print("\n" + "=" * 60)                                           # Line 46
    print(f"📌 Title: {result['title']}")                            # Line 47
    print(f"\n📋 Summary:\n{result['summary']}")                     # Line 48
    print(f"\n✅ Action Items:\n{result['action_items']}")            # Line 49
    print(f"\n🔑 Key Decisions:\n{result['key_decisions']}")          # Line 50
    print(f"\n❓ Open Questions:\n{result['open_questions']}")        # Line 51
    print("=" * 60)                                                  # Line 52
```

**Line 46-52:** Results print karo — title, summary, action items, decisions, questions. `"=" * 60` — 60 equal signs ka line separator bana rahe hain for readability.

```python
    # Phase 2 — Chat with your meeting via RAG
    print("\n💬 Chat with your meeting (type 'exit' to quit)\n")     # Line 55
    rag_chain = result["rag_chain"]                                  # Line 56
    while True:                                                      # Line 57
        question = input("You: ").strip()                            # Line 58
        if question.lower() in ["exit", "quit", "q"]:               # Line 59
            print("👋 Goodbye!")                                     # Line 60
            break                                                    # Line 61
        if not question:                                             # Line 62
            continue                                                 # Line 63
        answer = ask_question(rag_chain, question)                   # Line 64
        print(f"\n🤖 Assistant: {answer}\n")                         # Line 65
```

**Line 55-65:** **Interactive Chat Loop!** 

Yeh infinite loop hai (`while True`) jisme:
1. User se question lo
2. Agar "exit", "quit", ya "q" type kiya toh loop se bahar aao
3. Agar empty input hai toh skip karo
4. Warna RAG chain se answer lo aur print karo

Yeh basically ek mini chatbot hai jo tumhari meeting ke baare mein jawab deta hai!

---

---

# 12. 🧪 test.py — Quick Testing Script

> **Yeh ek simple testing script hai — quickly check karne ke liye ki pipeline kaam kar raha hai ya nahi.**

---

```python
from dotenv import load_dotenv                                       # Line 1
load_dotenv()   # MUST be before any core/ imports                   # Line 2
```

**Line 1-2:** `.env` load kar rahe hain. Comment bahut important hai — `load_dotenv()` **MUST be before** core imports. Kyun? Kyunki jab `core/` modules import hote hain, unke `os.getenv()` calls execute hote hain. Agar `load_dotenv()` pehle nahi hua toh env vars `None` honge.

```python
from utils.audio_processor import process_input                      # Line 4
from core.transcriber import transcribe_all                          # Line 5
from core.summarizer import summarize, generate_title                # Line 6
from core.extractor import extract_action_items, extract_key_decisions, extract_questions  # Line 7
```

**Line 4-7:** Imports — RAG import nahi hai yahan kyunki test.py sirf transcription + summarization + extraction test karta hai. RAG test nahi kar raha.

```python
source = "https://www.youtube.com/watch?v=_Q-e_nczWqM&t=223s"       # Line 10
language = "english"   # "english" → Whisper, "hinglish" → Sarvam   # Line 11
```

**Line 10:** Hardcoded YouTube URL — iss video pe test hoga.

**Line 11:** Language `"english"` set hai — Whisper use hoga. Comment bata raha hai ki `"hinglish"` pe Sarvam use hoga.

```python
chunks = process_input(source)                                       # Line 15
```

**Line 15:** Audio download + chunking.

```python
transcript = transcribe_all(chunks, language=language)               # Line 18
print("\n" + "=" * 60)                                               # Line 19
print("📝 TRANSCRIPT")                                               # Line 20
print("=" * 60)                                                      # Line 21
print(transcript[:500] + "..." if len(transcript) > 500 else transcript)  # Line 22
```

**Line 18:** Transcription.

**Line 22:** Agar transcript 500 characters se zyada hai toh pehle 500 print karo + "...", warna poora print karo. Yeh **ternary expression** hai Python mein.

```python
title = generate_title(transcript)                                   # Line 25
summary = summarize(transcript)                                      # Line 26
```

**Line 25-26:** Title aur summary generate karo.

```python
print("\n" + "=" * 60)                                               # Line 28
print(f"📌 TITLE: {title}")                                          # Line 29
# ... (similar print statements for summary, action items, decisions, questions)
```

**Line 28+:** Results print karo.

```python
action_items = extract_action_items(transcript)                      # Line 37
decisions = extract_key_decisions(transcript)                        # Line 38
questions = extract_questions(transcript)                            # Line 39
```

**Line 37-39:** Extraction — action items, decisions, questions.

```python
# ... (print all results with nice formatting)
print("❓ OPEN QUESTIONS")                                           # Line 52
print("=" * 60)                                                      # Line 53
print(questions)                                                     # Line 54
```

**Line 40-54:** Saare results formatted print karo.

**Note:** Yeh `test.py` **unit test nahi hai** (`pytest` ya `unittest` wali). Yeh ek **manual integration test** hai — run karo, output dekho, sahi lag raha hai ya nahi check karo.

---

---

# 13. 🎨 app.py — Streamlit Web UI (Full Breakdown)

> **Yeh sabse bada file hai (545 lines). Yeh poore project ka beautiful web interface hai.**
> Streamlit use karta hai — Python se web app banana.
> Custom CSS ke saath dark theme, animated background, aur chat UI.

---

## Section 1: Imports (Line 1-8)

```python
import streamlit as st                                               # Line 1
import time                                                          # Line 2
from dotenv import load_dotenv                                       # Line 3
from utils.audio_processor import process_input                      # Line 4
from core.transcriber import transcribe_all                          # Line 5
from core.summarizer import summarize, generate_title                # Line 6
from core.extractor import extract_action_items, extract_key_decisions, extract_questions  # Line 7
from core.rag_engine import build_rag_chain, ask_question            # Line 8
```

**Line 1:** `streamlit as st` — Streamlit import karo, `st` alias se (convention hai).

**Line 2:** `time` — `time.sleep()` ke liye — success message dikhane ke baad thoda wait karne ke liye.

**Line 3:** `load_dotenv` — API keys load karne ke liye.

**Line 4-8:** Saare pipeline functions import kar rahe hain — same as `main.py`.

```python
load_dotenv()                                                        # Line 10
```

**Line 10:** `.env` se API keys load karo.

---

## Section 2: Page Configuration (Line 12-18)

```python
# ─── Page Config ──────────────────────────────────────────
st.set_page_config(                                                  # Line 13
    page_title="AI Video Assistant",                                 # Line 14
    page_icon="🎬",                                                   # Line 15
    layout="wide",                                                   # Line 16
    initial_sidebar_state="expanded",                                # Line 17
)                                                                    # Line 18
```

**Line 13-18:** Streamlit page configuration.

- `page_title="AI Video Assistant"` — Browser tab mein dikhne wala title
- `page_icon="🎬"` — Browser tab ka favicon (emoji bhi de sakte ho!)
- `layout="wide"` — Full width layout. Default `"centered"` hota hai (narrow column). `"wide"` se poora screen use hoga.
- `initial_sidebar_state="expanded"` — Sidebar initially open hoga (collapsed nahi)

---

## Section 3: Custom CSS (Line 20-304)

Yeh bahut bada section hai — ~280 lines ka pure CSS. Streamlit ka default look boring hota hai (white background, basic styling). Is CSS se dark theme, animated grid background, custom cards, chat bubbles, aur bahut kuch bana rahe hain.

```python
st.markdown("""
<style>
...
</style>
""", unsafe_allow_html=True)
```

`st.markdown(..., unsafe_allow_html=True)` — Streamlit normally HTML allow nahi karta (security reasons). `unsafe_allow_html=True` se hum raw HTML/CSS inject kar sakte hain.

### CSS Root Variables (Line 26-39)

```css
:root {
    --bg: #0a0a0f;               /* Background — bahut dark almost black */
    --surface: #111118;           /* Card/sidebar background */
    --surface-2: #1a1a25;         /* Secondary surface (inputs, etc.) */
    --border: #2a2a3a;            /* Border color — subtle dark */
    --accent: #7c3aed;            /* Primary accent — vibrant purple */
    --accent-glow: #9f67ff;       /* Glowing purple (for highlights) */
    --accent-2: #06b6d4;          /* Secondary accent — cyan/teal */
    --text: #e8e8f0;              /* Main text — off-white */
    --text-muted: #7070a0;        /* Muted text — grayish purple */
    --success: #10b981;           /* Green — success states */
    --warning: #f59e0b;           /* Yellow/amber — warnings */
    --danger: #ef4444;            /* Red — errors */
}
```

**CSS Variables** (`--variable-name`) define kar rahe hain. Inka faayda: ek jagah change karo, poore app mein reflect hoga. Yeh **Design System** ka foundation hai.

Color scheme: **Dark theme with purple + cyan accents.** Very modern, very premium.

### Global Reset (Line 42-50)

```css
html, body, [class*="css"] {
    font-family: 'JetBrains Mono', monospace;
    background-color: var(--bg) !important;
    color: var(--text) !important;
}
```

Streamlit ke default styles override kar rahe hain:
- Font: **JetBrains Mono** (monospace font — developer/tech look)
- Background: Dark (`#0a0a0f`)
- Text: Off-white

`!important` — Streamlit apni inline styles lagata hai, `!important` se override hoti hain.

### Animated Grid Background (Line 53-64)

```css
.stApp::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image:
        linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
}
```

**::before pseudo-element** se ek **subtle grid pattern** background mein bana rahe hain:
- Purple lines ka grid (bahut faint — 3% opacity)
- 40px × 40px ke squares
- `pointer-events: none` — Clicks through ho jayein, grid clickable nahi hai
- `z-index: 0` — Content ke peeche rahega

Yeh **cyberpunk/tech aesthetics** ke liye common pattern hai — subtle grid lines in background.

### Hero Title (Line 83-102)

```css
.hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, var(--accent-glow) 50%, var(--accent-2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

**Gradient text effect!** 
- Font: **Syne** — bold, modern display font
- `clamp(2rem, 5vw, 3.5rem)` — Responsive font size:
  - Minimum: 2rem
  - Preferred: 5% of viewport width
  - Maximum: 3.5rem
- **Background gradient on text:**
  - White → Purple → Cyan gradient
  - `background-clip: text` + `text-fill-color: transparent` — Gradient text ke through dikhta hai!

### Cards (Line 104-145)

```css
.card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    transition: border-color 0.2s;
}

.card:hover {
    border-color: var(--accent);
}

.card::before {
    width: 3px; height: 100%;
    background: linear-gradient(180deg, var(--accent), var(--accent-2));
}
```

Cards ka design:
- Dark background
- Subtle border
- **Hover pe purple border glow** (transition ke saath smooth)
- **Left side pe purple-to-cyan gradient bar** (::before pseudo-element se)

### Status Dots with Pulse Animation (Line 215-228)

```css
.dot-active { 
    background: var(--accent-glow); 
    box-shadow: 0 0 8px var(--accent-glow); 
    animation: pulse 1.5s infinite; 
}
.dot-done { background: var(--success); }
.dot-pending { background: var(--border); }

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.4; }
}
```

Pipeline status indicators:
- **Active:** Purple dot with glow + **pulse animation** (blink hota hai)
- **Done:** Green dot (solid)
- **Pending:** Gray dot

### Chat Bubbles (Line 241-268)

```css
.user-bubble { 
    background: rgba(124,58,237,0.15); 
    border: 1px solid rgba(124,58,237,0.25); 
    align-self: flex-end; 
}
.bot-bubble { 
    background: rgba(6,182,212,0.1); 
    border: 1px solid rgba(6,182,212,0.2); 
    align-self: flex-start; 
}
```

Chat UI:
- **User messages:** Purple tint, right-aligned
- **Bot messages:** Cyan tint, left-aligned
- Semi-transparent backgrounds for glassmorphism effect

### Custom Scrollbar (Line 298-302)

```css
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }
```

Even scrollbar customize kiya hai! Thin, dark, purple on hover. Attention to detail.

---

## Section 4: Session State Initialization (Line 306-315)

```python
for key, default in {
    "result": None,                                                  # Line 308
    "chat_history": [],                                              # Line 309
    "processing": False,                                             # Line 310
    "pipeline_done": False,                                          # Line 311
    "pipeline_steps": {},                                            # Line 312
}.items():
    if key not in st.session_state:                                  # Line 314
        st.session_state[key] = default                              # Line 315
```

**Streamlit ka Session State** — bahut important concept!

Streamlit ka kaam karne ka tarika alag hai: **Jab bhi kuch hota hai (button click, input change), poori script top-to-bottom dubara run hoti hai.** Toh normally saare variables reset ho jaate hain.

`st.session_state` ek **persistent dictionary** hai jo reruns ke beech data preserve karta hai. Socho isse jaise browser ka `localStorage`.

Hum yeh initialize kar rahe hain:
- `"result"` — Pipeline ka output (None = abhi tak kuch process nahi hua)
- `"chat_history"` — Chat messages ki list (empty initially)
- `"processing"` — Kya pipeline abhi chal raha hai? (False)
- `"pipeline_done"` — Kya pipeline complete ho gaya? (False)
- `"pipeline_steps"` — Har step ka status (empty dict)

`if key not in st.session_state` — Sirf tab set karo jab pehle se exist nahi karta (pehli baar run pe). Warna har rerun pe data reset ho jayega!

---

## Section 5: Helper Functions (Line 317-330)

```python
def step_status(steps: dict, key: str) -> str:                      # Line 318
    s = steps.get(key, "pending")                                    # Line 319
    if s == "active":  return "dot-active"                           # Line 320
    if s == "done":    return "dot-done"                             # Line 321
    return "dot-pending"                                             # Line 322
```

**Line 318-322:** Pipeline step ka status CSS class return karta hai:
- `"active"` → `"dot-active"` (purple pulsing dot)
- `"done"` → `"dot-done"` (green dot)
- Default → `"dot-pending"` (gray dot)

```python
def render_step_bar(label: str, key: str, icon: str):               # Line 324
    css = step_status(st.session_state.pipeline_steps, key)          # Line 325
    st.markdown(f"""
    <div class="status-bar">
        <div class="status-dot {css}"></div>
        <span>{icon} {label}</span>
    </div>""", unsafe_allow_html=True)                               # Line 330
```

**Line 324-330:** Sidebar mein pipeline step status bar render karta hai. Icon + label + colored dot.

---

## Section 6: Sidebar (Line 332-356)

```python
with st.sidebar:                                                     # Line 333
    st.markdown('<div class="hero-title" style="font-size:1.6rem">🎬 AI<br>Video</div>',
                unsafe_allow_html=True)                              # Line 334
    st.markdown('<div class="hero-sub">Meeting Intelligence</div>',
                unsafe_allow_html=True)                              # Line 335
    st.markdown("---")                                               # Line 336
```

**Line 333:** `with st.sidebar:` — Is block ke andar sab kuch sidebar mein render hoga.

**Line 334-335:** Sidebar ka title — "🎬 AI Video" with "Meeting Intelligence" subtitle.

**Line 336:** Horizontal rule (divider).

```python
    st.markdown('<span class="badge badge-purple">Input</span>',
                unsafe_allow_html=True)                              # Line 338
    source = st.text_input("YouTube URL or File Path", 
                           placeholder="https://youtube.com/watch?v=... or /path/to/file.mp4")  # Line 339
    language = st.selectbox("Language", ["english", "hinglish"], index=0)  # Line 341
    run_btn = st.button("⚡  Analyse", use_container_width=True)     # Line 343
```

**Line 338:** Purple badge "Input" — visual label.

**Line 339:** Text input field — user yahan URL ya path daalega.
- `placeholder` — Gray text dikhega jab field empty ho

**Line 341:** Dropdown — language select karo. `index=0` se default "english" selected hoga.

**Line 343:** "⚡ Analyse" button — `use_container_width=True` se button poori sidebar ki width lega.
- `run_btn` mein `True`/`False` store hoga — `True` jab button click hua

```python
    if st.session_state.pipeline_done:                               # Line 345
        st.markdown("---")                                           # Line 346
        st.markdown('<span class="badge badge-green">Pipeline Status</span>',
                    unsafe_allow_html=True)                          # Line 347
        for step, icon, label in [                                   # Line 348
            ("audio",      "🔊", "Audio Processing"),
            ("transcript", "📝", "Transcription"),
            ("title",      "🏷️", "Title Generation"),
            ("summary",    "📋", "Summarisation"),
            ("extract",    "🔍", "Extraction"),
            ("rag",        "🧠", "RAG Engine"),
        ]:                                                           # Line 355
            render_step_bar(label, step, icon)                       # Line 356
```

**Line 345-356:** Agar pipeline complete ho gaya hai, toh sidebar mein har step ka status dikhao (green dots).

---

## Section 7: Main Area Header (Line 358-361)

```python
st.markdown('<div class="hero-title">AI Video Assistant</div>',
            unsafe_allow_html=True)                                  # Line 359
st.markdown('<div class="hero-sub">Transcribe · Summarise · Chat with your meetings</div>',
            unsafe_allow_html=True)                                  # Line 360
st.markdown("---")                                                   # Line 361
```

**Line 359-361:** Main area ka hero title:
- "AI Video Assistant" — Gradient text (CSS se)
- "Transcribe · Summarise · Chat with your meetings" — Subtitle

---

## Section 8: Pipeline Execution (Line 363-427)

```python
if run_btn:                                                          # Line 364
    if not source.strip():                                           # Line 365
        st.error("Please enter a YouTube URL or file path.")         # Line 366
```

**Line 364:** Agar "Analyse" button click hua.

**Line 365-366:** Agar source empty hai toh error dikhao. `st.error()` — Red error box render karta hai.

```python
    else:
        st.session_state.pipeline_done = False                       # Line 368
        st.session_state.result = None                               # Line 369
        st.session_state.chat_history = []                           # Line 370
        st.session_state.pipeline_steps = {}                         # Line 371
```

**Line 368-371:** Naya analysis start karne se pehle saare purane results clear karo.

```python
        progress_placeholder = st.empty()                            # Line 373
```

**Line 373:** `st.empty()` — Ek empty placeholder banao. Isme hum dynamically content daal sakte hain aur hata sakte hain. Useful for showing progress messages that change.

```python
        def update_step(key, state):                                 # Line 375
            st.session_state.pipeline_steps[key] = state             # Line 376
```

**Line 375-376:** Helper function — step ka status update karta hai (e.g., `update_step("audio", "active")`).

```python
        try:                                                         # Line 378
            with progress_placeholder.container():                   # Line 379
                st.info("⚙️ Pipeline running — see sidebar for live status…")  # Line 380
```

**Line 378-380:** Try block start karo. Info message dikhao: "Pipeline chal raha hai — sidebar mein status dekho."

```python
            update_step("audio", "active")                           # Line 382
            chunks = process_input(source)                           # Line 383
            update_step("audio", "done")                             # Line 384
```

**Line 382-384:** **Audio Processing Step:**
1. Status: Active (purple pulsing dot sidebar mein)
2. Audio download + chunk karo
3. Status: Done (green dot)

```python
            update_step("transcript", "active")                      # Line 386
            transcript = transcribe_all(chunks, language)            # Line 387
            update_step("transcript", "done")                        # Line 388
```

**Line 386-388:** **Transcription Step:** Same pattern.

```python
            update_step("title", "active")                           # Line 390
            title = generate_title(transcript)                       # Line 391
            update_step("title", "done")                             # Line 392
```

**Line 390-392:** **Title Generation Step.**

```python
            update_step("summary", "active")                         # Line 394
            summary = summarize(transcript)                          # Line 395
            update_step("summary", "done")                           # Line 396
```

**Line 394-396:** **Summarization Step.**

```python
            update_step("extract", "active")                         # Line 398
            action_items  = extract_action_items(transcript)         # Line 399
            decisions     = extract_key_decisions(transcript)        # Line 400
            questions     = extract_questions(transcript)            # Line 401
            update_step("extract", "done")                           # Line 402
```

**Line 398-402:** **Extraction Step** — teeno extractions ek step mein.

```python
            update_step("rag", "active")                             # Line 404
            rag_chain = build_rag_chain(transcript)                  # Line 405
            update_step("rag", "done")                               # Line 406
```

**Line 404-406:** **RAG Engine Step** — Vector store + chain build.

```python
            st.session_state.result = {                              # Line 408
                "title": title,
                "transcript": transcript,
                "summary": summary,
                "action_items": action_items,
                "key_decisions": decisions,
                "open_questions": questions,
                "rag_chain": rag_chain,
            }                                                        # Line 416
            st.session_state.pipeline_done = True                    # Line 417
            progress_placeholder.success("✅ Analysis complete!")     # Line 418
            time.sleep(0.5)                                          # Line 419
            progress_placeholder.empty()                             # Line 420
            st.rerun()                                               # Line 421
```

**Line 408-421:** Pipeline complete!
1. Results session state mein save karo
2. `pipeline_done = True` mark karo
3. Success message dikhao
4. 0.5 second wait karo (taaki user success message dekh sake)
5. Progress placeholder empty karo
6. `st.rerun()` — **Page rerun karo!** Kyun? Kyunki Streamlit mein script top-to-bottom chalti hai, aur results section tabhi render hoga jab `st.session_state.result` set hai. Rerun se script dubara chalegi aur results dikhengi.

```python
        except Exception as e:                                       # Line 423
            for k in ["audio","transcript","title","summary","extract","rag"]:  # Line 424
                if st.session_state.pipeline_steps.get(k) == "active":  # Line 425
                    st.session_state.pipeline_steps[k] = "pending"   # Line 426
            progress_placeholder.error(f"❌ Error: {e}")             # Line 427
```

**Line 423-427:** Error handling:
- Jo step active tha (jahan error aaya), usko pending pe wapas karo
- Error message dikhao

---

## Section 9: Results Display (Line 429-478)

```python
if st.session_state.result:                                          # Line 430
    r = st.session_state.result                                      # Line 431
```

**Line 430-431:** Agar results hain toh dikhao.

### Title Banner

```python
    st.markdown(f"""
    <div class="card">
        <div class="card-title">📌 Session Title</div>
        <div style="font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:700;color:var(--text)">
            {r['title']}
        </div>
    </div>""", unsafe_allow_html=True)                               # Line 440
```

Meeting title ek card mein dikhao.

### Summary + Transcript (Two Columns)

```python
    col1, col2 = st.columns([3, 2], gap="medium")                   # Line 443
```

**Line 443:** Do columns banao — 3:2 ratio mein. Left column bada (summary), right column chhota (transcript).

```python
    with col1:                                                       # Line 445
        st.markdown(f"""
        <div class="card">
            <div class="card-title">📋 Summary</div>
            <div class="card-content">{r['summary']}</div>
        </div>""", unsafe_allow_html=True)                           # Line 450
```

**Line 445-450:** Left column mein summary card.

```python
    with col2:                                                       # Line 452
        with st.expander("📝 Full Transcript", expanded=False):     # Line 453
            st.markdown(f'<div class="transcript-box">{r["transcript"]}</div>',
                        unsafe_allow_html=True)                      # Line 454
```

**Line 452-454:** Right column mein transcript — `st.expander` mein (collapsible section). Default collapsed hai (`expanded=False`) kyunki transcript bahut lamba hota hai.

### Three Column Cards (Action Items, Decisions, Questions)

```python
    c1, c2, c3 = st.columns(3, gap="medium")                        # Line 457
```

**Line 457:** Teen equal columns.

```python
    with c1:                                                         # Line 459
        # Action Items card
    with c2:                                                         # Line 466
        # Key Decisions card
    with c3:                                                         # Line 473
        # Open Questions card
```

Teeno columns mein respective cards.

---

## Section 10: RAG Chat Interface (Line 482-527)

```python
    st.markdown('<div style="...">💬 Chat with your Meeting</div>',
                unsafe_allow_html=True)                              # Line 483
```

**Line 483:** Chat section ka heading.

### Chat History Display

```python
    if st.session_state.chat_history:                                # Line 486
        chat_html = '<div class="chat-container">'                   # Line 487
        for msg in st.session_state.chat_history:                    # Line 488
            if msg["role"] == "user":                                # Line 489
                chat_html += f"""
                <div class="chat-msg" style="align-items:flex-end">
                    <span class="chat-label user-label">You</span>
                    <div class="chat-bubble user-bubble">{msg['content']}</div>
                </div>"""                                            # Line 494
            else:                                                    # Line 495
                chat_html += f"""
                <div class="chat-msg" style="align-items:flex-start">
                    <span class="chat-label bot-label">🤖 Assistant</span>
                    <div class="chat-bubble bot-bubble">{msg['content']}</div>
                </div>"""                                            # Line 500
        chat_html += '</div>'                                        # Line 501
        st.markdown(chat_html, unsafe_allow_html=True)               # Line 502
```

**Line 486-502:** Chat history render karna.

Yeh interesting approach hai — **saara chat HTML ek string mein build kar rahe hain** aur phir ek baar render kar rahe hain. Kyun? Kyunki Streamlit mein har `st.markdown()` call ek naya element banata hai. Agar har message ke liye alag call karte toh layout consistent nahi hota.

Har message ka structure:
- **User messages:** Purple bubble, right-aligned, "You" label
- **Bot messages:** Cyan bubble, left-aligned, "🤖 Assistant" label

```python
    else:                                                            # Line 503
        st.markdown("""
        <div class="card" style="text-align:center;padding:2rem">
            <div style="font-size:2rem;margin-bottom:0.5rem">💬</div>
            <div style="color:var(--text-muted);font-size:0.85rem">
                Ask anything about your meeting transcript
            </div>
        </div>""", unsafe_allow_html=True)                           # Line 508
```

**Line 503-508:** Agar koi chat history nahi hai toh empty state dikhao — "Ask anything about your meeting transcript" message.

### Chat Input + Send Button

```python
    chat_col1, chat_col2 = st.columns([5, 1], gap="small")          # Line 511
    with chat_col1:                                                  # Line 512
        user_input = st.text_input("Your question", 
                                   placeholder="What were the main decisions made?",
                                   label_visibility="collapsed")     # Line 513
    with chat_col2:                                                  # Line 514
        send_btn = st.button("Send →", use_container_width=True)     # Line 515
```

**Line 511-515:** Input area — text input (wide) + send button (narrow), 5:1 ratio.
- `label_visibility="collapsed"` — Label hide karo (sirf placeholder dikhega)

### Send Logic

```python
    if send_btn and user_input.strip():                              # Line 517
        with st.spinner("Thinking…"):                                # Line 518
            answer = ask_question(r["rag_chain"], user_input.strip())  # Line 519
        st.session_state.chat_history.append({"role": "user", "content": user_input.strip()})  # Line 520
        st.session_state.chat_history.append({"role": "assistant", "content": answer})  # Line 521
        st.rerun()                                                   # Line 522
```

**Line 517-522:** Jab Send button click ho aur input empty na ho:
1. `st.spinner("Thinking…")` — Spinner dikhao (loading indicator)
2. RAG chain se answer lo
3. User message aur bot answer dono chat history mein add karo
4. `st.rerun()` — Page rerun karo taaki naya message dikhe

### Clear Chat Button

```python
    if st.session_state.chat_history:                                # Line 524
        if st.button("🗑️ Clear Chat", type="secondary"):            # Line 525
            st.session_state.chat_history = []                       # Line 526
            st.rerun()                                               # Line 527
```

**Line 524-527:** Agar chat history hai toh "Clear Chat" button dikhao. Click pe history clear karo.

---

## Section 11: Empty State (Line 529-545)

```python
else:                                                                # Line 529
    # Empty state
    st.markdown("""
    <div style="display:flex;flex-direction:column;align-items:center;
                justify-content:center;padding:5rem 2rem;text-align:center">
        <div style="font-size:4rem;margin-bottom:1rem">🎬</div>
        <div style="...">Ready to Analyse</div>
        <div style="...">
            Paste a YouTube URL or local file path in the sidebar,
            choose your language, and hit <strong>Analyse</strong> to get started.
        </div>
        <div style="...">
            <span class="badge badge-purple">Transcription</span>
            <span class="badge badge-cyan">Summarisation</span>
            <span class="badge badge-green">RAG Chat</span>
        </div>
    </div>""", unsafe_allow_html=True)                               # Line 545
```

**Line 529-545:** Jab koi result nahi hai (pehli baar ya fresh load pe):
- Bada 🎬 emoji
- "Ready to Analyse" heading
- Instructions — kya karna hai batao
- Three badges — Transcription, Summarisation, RAG Chat (teeno features highlight)

---

---

# 14. 🔄 Data Flow Diagram

## Poora Pipeline Kaise Chalta Hai — Step by Step

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                  │
│  YouTube URL: "https://youtube.com/watch?v=abc123"                  │
│  Language: "english"                                                │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: Audio Processing  (utils/audio_processor.py)               │
│                                                                     │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│  │ download_youtube  │    │  convert_to_wav  │    │ chunk_audio  │  │
│  │ _audio()          │ OR │  ()              │ →  │ ()           │  │
│  │ (YouTube URL)     │    │  (Local file)    │    │ (10-min      │  │
│  │                   │    │                  │    │  chunks)     │  │
│  └──────────────────┘    └──────────────────┘    └──────────────┘  │
│                                                                     │
│  Output: ["chunk_0.wav", "chunk_1.wav", "chunk_2.wav"]              │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Transcription  (core/transcriber.py)                       │
│                                                                     │
│  language == "english"?                                              │
│  ├── YES → Whisper (local model, "small" size)                      │
│  │         Har chunk → model.transcribe() → text                    │
│  │                                                                  │
│  └── NO  → Sarvam AI (API call)                                     │
│            Har chunk → 25s pieces → API call → text                 │
│                                                                     │
│  Output: "Full transcript text of the entire video..."              │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Title Generation  (core/summarizer.py)                     │
│                                                                     │
│  transcript[:2000] → Mistral AI → "Weekly Sprint Planning Review"   │
│                                                                     │
│  Output: "Weekly Sprint Planning Review"                            │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: Summarization  (core/summarizer.py)                        │
│                                                                     │
│  MAP PHASE:                                                         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐                          │
│  │ Chunk 1 │→  │ Chunk 2 │→  │ Chunk 3 │→  ... → Partial Summaries│
│  │ →LLM    │   │ →LLM    │   │ →LLM    │                          │
│  └─────────┘   └─────────┘   └─────────┘                          │
│                                                                     │
│  REDUCE PHASE:                                                      │
│  All Partial Summaries → LLM → Final Bullet-Point Summary          │
│                                                                     │
│  Output: "• Team discussed deployment timeline\n• Budget approved"  │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5: Extraction  (core/extractor.py)                            │
│                                                                     │
│  transcript → LLM (3 different prompts) →                           │
│    ├── Action Items: "1. Deploy by Friday (Owner: Rahul)"           │
│    ├── Key Decisions: "1. Budget approved at 50K"                   │
│    └── Open Questions: "1. Who will handle QA testing?"             │
│                                                                     │
│  Output: 3 formatted strings                                        │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 6: RAG Engine  (core/rag_engine.py + core/vector_store.py)    │
│                                                                     │
│  transcript                                                         │
│    → split into 500-char chunks                                     │
│    → convert to embeddings (all-MiniLM-L6-v2)                       │
│    → store in ChromaDB                                              │
│    → build retriever (top-4 similar)                                │
│    → build LCEL chain: retriever → prompt → LLM → parser            │
│                                                                     │
│  Output: rag_chain (ready for Q&A)                                  │
└─────────────────────┬───────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────────┐
│  RESULTS DISPLAYED                                                   │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Title   │  │ Summary  │  │ Action   │  │  Chat    │           │
│  │          │  │          │  │ Items    │  │  (RAG)   │           │
│  │          │  │          │  │ + More   │  │          │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

---

---

# 15. 📚 Concepts Deep Dive

## 15.1 LangChain LCEL (LangChain Expression Language)

LCEL poore project mein use ho raha hai. Samjho detail mein:

```python
chain = component_1 | component_2 | component_3
result = chain.invoke(input)
```

`|` operator **pipe** hai — ek component ka output next component ka input ban jaata hai. Exactly jaise Linux terminal mein:
```bash
cat file.txt | grep "error" | wc -l
```

### LCEL ke Building Blocks:

| Component | Kya Karta Hai | Example |
|---|---|---|
| `RunnablePassthrough()` | Input as-is pass karta hai | "hello" → "hello" |
| `RunnableLambda(fn)` | Koi bhi function run karta hai | `lambda x: {"text": x}` |
| `ChatPromptTemplate` | Prompt template fill karta hai | `{text}` → actual text |
| `ChatMistralAI` | LLM se response lata hai | text → AI response |
| `StrOutputParser()` | AIMessage → plain string | AIMessage → "answer text" |
| `RunnableParallel` (dict) | Multiple branches parallel | `{"a": chain1, "b": chain2}` |
| `retriever` | Vector store mein search karta hai | question → relevant docs |

### Real Example from this project:

```python
# extractor.py mein:
chain = (
    RunnablePassthrough()                    # 1. "Full transcript..." as-is
    | RunnableLambda(lambda x: {"text": x})  # 2. → {"text": "Full transcript..."}
    | ChatPromptTemplate.from_messages([...]) # 3. → "System: Extract action items. Human: Full transcript..."
    | llm                                     # 4. → AIMessage("1. Deploy by Friday...")
    | StrOutputParser()                       # 5. → "1. Deploy by Friday..."
)
```

---

## 15.2 RAG (Retrieval Augmented Generation) — Detailed

### Problem:
LLM ko tumhari meeting ke baare mein kuch nahi pata. Training data mein tumhari meeting nahi hai.

### Naive Solution:
Poora transcript LLM ke prompt mein daal do.

### Problem with Naive Solution:
1. Token limit — Transcript bahut bada ho sakta hai (LLM ki limit 32K tokens hai)
2. Cost — Bahut saare tokens = bahut zyada API cost
3. "Needle in a Haystack" — LLM ko bade context mein specific info dhundna mushkil hota hai

### RAG Solution:
1. **Index Phase** (ek baar):
   - Transcript ko chhote chunks mein todo (500 chars each)
   - Har chunk ki embedding generate karo (384-dimensional vector)
   - Embeddings ko vector database (ChromaDB) mein store karo

2. **Query Phase** (har sawaal pe):
   - User ka question lo
   - Question ki embedding generate karo
   - Vector database mein **nearest neighbors** dhundho (cosine similarity)
   - Top-4 relevant chunks nikalo
   - In chunks ko LLM ke prompt mein daal do (as context)
   - LLM answer generate kare sirf in chunks ke basis pe

### Kyun RAG better hai?
- **Token efficient** — Sirf relevant chunks bhejte ho, poora transcript nahi
- **Cost efficient** — Kam tokens = kam cost
- **Accurate** — LLM ko focused context milta hai, hallucination kam hota hai
- **Scalable** — 10-hour meeting bhi handle ho sakti hai

---

## 15.3 Embeddings Kya Hain?

**Embedding** = text ka mathematical representation (vector of numbers).

```
"The team decided to increase the budget"
   → [0.23, -0.45, 0.12, 0.78, ..., 0.56]  (384 numbers)

"Budget was approved for expansion"
   → [0.21, -0.42, 0.15, 0.75, ..., 0.54]  (384 numbers)  ← SIMILAR vectors!

"The weather was nice today"
   → [0.89, 0.34, -0.67, 0.11, ..., -0.23]  (384 numbers)  ← DIFFERENT vectors!
```

Similar meaning wale texts ke vectors ek dusre ke **close** hote hain (Euclidean distance ya cosine similarity measure se).

**`all-MiniLM-L6-v2`** model yeh kaam karta hai:
- Input: English text (sentence/paragraph)
- Output: 384-dimensional vector
- Trained on: 1 billion sentence pairs
- Size: ~80MB

---

## 15.4 Whisper vs Sarvam AI

| Feature | Whisper | Sarvam AI |
|---|---|---|
| **Type** | Local model | Cloud API |
| **Internet needed?** | Nahi (download ke baad) | Haan |
| **Best for** | English | Indian languages (Hindi, Hinglish) |
| **Speed** | GPU pe fast, CPU pe slow | Network pe depend karta hai |
| **Cost** | Free (local) | API usage charges |
| **Privacy** | Audio local rahta hai | Audio server pe jaata hai |
| **Audio limit** | Koi limit nahi | 30 seconds per request |
| **Accuracy (English)** | Excellent | Good |
| **Accuracy (Hindi)** | Average | Excellent |

### Kyun dono?
English meetings ke liye Whisper best hai (free, private, accurate).
Hinglish/Hindi meetings ke liye Sarvam AI best hai (Indian languages mein specialized).
User ko choice de rahe hain.

---

## 15.5 Streamlit Ka Kaam Karne Ka Tarika

Streamlit ek alag tarah se kaam karta hai:

```
1. User opens app → Script runs top to bottom → UI renders

2. User clicks button → ENTIRE Script runs top to bottom AGAIN → UI re-renders

3. User types in input → ENTIRE Script runs top to bottom AGAIN → UI re-renders
```

**Har interaction pe poori script dubara chalti hai!**

Isliye `st.session_state` zaroori hai — warna saari variables har rerun pe reset ho jayengi.

Isliye `st.rerun()` call karte hain — jab data change ho (like new chat message), toh UI update karne ke liye script dubara chalani padti hai.

---

## 15.6 Map-Reduce Summarization Pattern

```
┌─────────────────────────────────────────────┐
│              Original Text                   │
│  (10,000+ characters - too big for LLM)     │
└─────────────┬───────────────────────────────┘
              │ split into chunks
              ↓
┌────┐  ┌────┐  ┌────┐  ┌────┐
│ C1 │  │ C2 │  │ C3 │  │ C4 │   ← Chunks (3000 chars each)
└──┬─┘  └──┬─┘  └──┬─┘  └──┬─┘
   │       │       │       │
   ↓       ↓       ↓       ↓      ← MAP: Each chunk → LLM → Summary
┌────┐  ┌────┐  ┌────┐  ┌────┐
│ S1 │  │ S2 │  │ S3 │  │ S4 │   ← Partial Summaries
└──┬─┘  └──┬─┘  └──┬─┘  └──┬─┘
   │       │       │       │
   └───────┴───────┴───────┘
              │ combine
              ↓
   ┌──────────────────┐
   │ Combined Text    │               ← All partial summaries joined
   │ (S1 + S2 + S3    │
   │  + S4)           │
   └────────┬─────────┘
            │
            ↓                         ← REDUCE: Combined → LLM → Final
   ┌──────────────────┐
   │  FINAL SUMMARY   │
   │  (Bullet points) │
   └──────────────────┘
```

**Kyun Direct Summarization Nahi?**
- LLM ki context window limit hai
- 10K+ characters ek baar mein bhejne pe accuracy gir jaati hai
- Map-Reduce se har chunk pe focused processing hoti hai

---

## 15.7 Environment Variables aur Security

```
.env file:
MISTRAL_API_KEY=sk-abcdef123456
SARVAM_API_KEY=xyz789
WHISPER_MODEL=small
```

**Kyun .env file?**
1. **Security** — API keys code mein hardcode nahi honi chahiye
2. **Flexibility** — Different environments (dev/prod) mein different keys
3. **Git safety** — `.gitignore` mein hai, toh GitHub pe nahi jayegi

**Flow:**
```
.env file → load_dotenv() → os.getenv("KEY") → value available everywhere
```

---

---

## 🎯 Final Summary

### Ek Line Mein Har File:

| File | Kya Karta Hai |
|---|---|
| **Requirements.txt** | Saari dependencies ki shopping list |
| **.gitignore** | Git ko bolta hai .env ko ignore karo |
| **utils/audio_processor.py** | YouTube se audio download + chunks mein todna |
| **core/transcriber.py** | Audio → Text (Whisper ya Sarvam se) |
| **core/summarizer.py** | Text → Summary + Title (Mistral AI se) |
| **core/extractor.py** | Text → Action Items + Decisions + Questions |
| **core/vector_store.py** | Text → Embeddings → ChromaDB mein store |
| **core/rag_engine.py** | RAG chain — meeting se chat karne ke liye |
| **main.py** | CLI se poora pipeline chalao |
| **test.py** | Quick test — hardcoded URL pe pipeline run karo |
| **app.py** | Beautiful Streamlit Web UI |

### Project Ke Core Technologies:

| Tech | Role |
|---|---|
| **yt-dlp + pydub** | Audio acquisition + processing |
| **Whisper** | English speech-to-text (local) |
| **Sarvam AI** | Hinglish speech-to-text (API) |
| **LangChain LCEL** | LLM chain orchestration |
| **Mistral AI** | Text understanding + generation |
| **ChromaDB** | Vector storage for semantic search |
| **HuggingFace** | Text embeddings (all-MiniLM-L6-v2) |
| **Streamlit** | Web UI framework |

### Pipeline in 6 Steps:

```
1. 🔊 Audio Download → 2. 📝 Transcription → 3. 🏷️ Title
→ 4. 📋 Summary → 5. 🔍 Extraction → 6. 🧠 RAG Chat
```

---

> **Ab tumhe pata hai ki yeh project kya karta hai, kyun karta hai, aur kaise karta hai!** 🚀
> Har line, har function, har concept — crystal clear! 💎
