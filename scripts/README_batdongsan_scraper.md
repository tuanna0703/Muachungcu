# Batdongsan Playwright Scraper

## Cài đặt
```bash
python3 -m pip install playwright
python3 -m playwright install chromium
```

## Chạy crawl
```bash
python3 scripts/scrape_batdongsan_projects.py \
  --url "https://batdongsan.com.vn/du-an-can-ho-chung-cu-ha-noi" \
  --max-pages 3 \
  --output data/batdongsan_projects.json \
  --csv data/batdongsan_projects.csv
```

## Ghi chú
- Nếu website bật anti-bot, thử dùng `--headed` để mở trình duyệt có giao diện.
- Script hiện lưu các trường: `title`, `url`, `location`, `price`, `area`, `investor`.
