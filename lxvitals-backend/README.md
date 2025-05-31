# LXVitals Backend

A system monitoring API for Linux machines that provides information about CPU, GPU, memory, storage drives, and network status.

## Features

- CPU monitoring (usage, temperature, fan speed)
- GPU monitoring (temperature, availability)
- Memory usage statistics
- Storage drive information
- Network bandwidth monitoring

## Technology Stack

- FastAPI - Modern, fast web framework for building APIs
- Psutil - Cross-platform library for retrieving system information
- PySensors - Python binding to libsensors (for temperature readings)

## Project Structure

```
lxvitals/backend/
│
├── app/                    # Main application package
│   ├── api/                # API definition and endpoints
│   │   ├── endpoints/      # API endpoint modules
│   │   └── router.py       # Main API router
│   ├── core/               # Core application code
│   │   └── config.py       # Configuration settings
│   ├── services/           # Business logic services
│   │   ├── system_monitor.py  # System monitoring service
│   │   └── network_monitor.py # Network monitoring service
│   └── utils/              # Utility functions
│       └── utils.py        
│
├── tests/                  # Test package
│   ├── conftest.py         # Test configuration and fixtures
│   ├── test_api/           # API endpoint tests
│   └── test_services/      # Service tests
│
├── .env                    # Environment variables (not in git)
├── .env.example            # Example environment variables
├── main.py                 # Application entry point
├── requirements.txt        # Dependencies
└── README.md               # This file
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file based on `.env.example`
4. Run the application:
   ```
   python main.py
   ```

## API Endpoints

### System Monitoring Endpoints

- `GET /api/system/` - Get complete system status
- `GET /api/system/cpu` - Get CPU statistics
- `GET /api/system/memory` - Get memory usage
- `GET /api/system/gpu` - Get GPU statistics
- `GET /api/system/drives` - Get drive information

### Network Monitoring Endpoints

- `GET /api/network/` - Get network statistics
- `GET /api/network/wifi` - Get network wifi information
- `GET /api/network/speed` - Get network speed test results

## Development

To run tests:
```
pytest
```

## Environment Variables

- `DRIVE_PATH`: Path to mounted drives (default: "/mnt")
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS (default: "*")
- `PLATFORM`: Platform type (default: "linux")