# Project Setup Guide

## Prerequisites

- **Docker** must be installed on your system:  
  👉 [Install Docker](https://docs.docker.com/get-docker/)

- **Make** must be available on your system:  
  (Linux/macOS: usually preinstalled, Windows users can use WSL or install Make via Chocolatey or Scoop)

## Setup Instructions

### 1. Create a `.env` file

In the root of the project directory, create a `.env` file with the following content:

```env
# Your local IP address (example: 192.168.1.21)
IPNAME=192.168.1.21

# Your email address used for 2FA or mail notifications
EMAIL=your-email@example.com

# SMTP password (used to send emails from the server)
PASSWORD_SMP=your-smtp-password

# A random string used to sign JWT tokens
JWT_SECRET=randomlyGeneratedSecretKey
```

### 2. Launch the project

Once your `.env` file is ready, build and start the project using:

```bash
sudo make
```

After the project is running, open your web browser and navigate to:

```https://<your local IP address>```
