#!/usr/bin/env python3
"""Scrape apartment project information from batdongsan.com.vn using Playwright.

Example:
    python3 scripts/scrape_batdongsan_projects.py \
        --url "https://batdongsan.com.vn/du-an-can-ho-chung-cu-ha-noi" \
        --max-pages 3 --output projects.json
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urljoin

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright

DEFAULT_URL = "https://batdongsan.com.vn/du-an-can-ho-chung-cu-ha-noi"


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def extract_projects_from_page(page) -> List[Dict[str, str]]:
    cards = page.locator('li.js__project-item, li.project-item, li.re__prj-item, div.re__prj-card, div.prj-card')
    count = cards.count()

    projects: List[Dict[str, str]] = []

    for idx in range(count):
        card = cards.nth(idx)

        title_loc = card.locator('h3 a, h2 a, a.re__link-prj, a.js__product-link, a[href*="/du-an-"]')
        title = clean_text(title_loc.first.inner_text()) if title_loc.count() else ""
        href = title_loc.first.get_attribute("href") if title_loc.count() else ""

        if not title:
            title = clean_text(card.locator("h3, h2").first.inner_text()) if card.locator("h3, h2").count() else ""

        if href:
            href = urljoin("https://batdongsan.com.vn", href)

        location = ""
        price = ""
        area = ""
        investor = ""

        kv_rows = card.locator("p, span, div")
        kv_count = min(kv_rows.count(), 20)
        for j in range(kv_count):
            text = clean_text(kv_rows.nth(j).inner_text())
            lower = text.lower()

            if not location and any(k in lower for k in ["địa chỉ", "vị trí", "khu vực"]):
                location = text
            if not price and any(k in lower for k in ["giá", "từ", "triệu/m²", "tỷ"]):
                price = text
            if not area and any(k in lower for k in ["diện tích", "m²"]):
                area = text
            if not investor and any(k in lower for k in ["chủ đầu tư", "investor"]):
                investor = text

        project = {
            "title": title,
            "url": href or "",
            "location": location,
            "price": price,
            "area": area,
            "investor": investor,
        }

        if project["title"] or project["url"]:
            projects.append(project)

    # Remove duplicates while keeping order
    unique = []
    seen = set()
    for p in projects:
        key = (p["title"], p["url"])
        if key not in seen:
            seen.add(key)
            unique.append(p)

    return unique


def goto_next_page(page) -> bool:
    next_btn = page.locator(
        'a.re__pagination-icon[aria-label*="Sau"], a.re__pagination-icon[aria-label*="Next"], a[rel="next"], a:has-text("Sau")'
    )
    if not next_btn.count():
        return False

    button = next_btn.first
    classes = (button.get_attribute("class") or "").lower()
    if "disabled" in classes:
        return False

    previous_url = page.url
    button.click()
    page.wait_for_load_state("networkidle")
    return page.url != previous_url


def scrape_projects(url: str, max_pages: int, timeout_ms: int, headless: bool) -> List[Dict[str, str]]:
    all_projects: List[Dict[str, str]] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            )
        )
        page = context.new_page()

        try:
            page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
            page.wait_for_load_state("networkidle", timeout=timeout_ms)
        except PlaywrightTimeoutError:
            print("[WARN] Timeout khi mở trang, sẽ tiếp tục lấy dữ liệu hiện có.", file=sys.stderr)

        for page_no in range(1, max_pages + 1):
            page_projects = extract_projects_from_page(page)
            print(f"[INFO] Page {page_no}: lấy được {len(page_projects)} dự án")
            all_projects.extend(page_projects)

            if page_no >= max_pages:
                break

            try:
                moved = goto_next_page(page)
            except PlaywrightTimeoutError:
                print("[WARN] Timeout khi chuyển trang.", file=sys.stderr)
                break

            if not moved:
                break

            time.sleep(1)

        browser.close()

    # dedupe across pages
    unique = []
    seen = set()
    for p in all_projects:
        key = (p["title"], p["url"])
        if key not in seen:
            seen.add(key)
            unique.append(p)

    return unique


def save_json(data: List[Dict[str, str]], output: Path) -> None:
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def save_csv(data: List[Dict[str, str]], output: Path) -> None:
    fieldnames = ["title", "url", "location", "price", "area", "investor"]
    with output.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape dự án chung cư từ batdongsan.com.vn bằng Playwright")
    parser.add_argument("--url", default=DEFAULT_URL, help="Link danh sách dự án")
    parser.add_argument("--max-pages", type=int, default=2, help="Số trang tối đa cần crawl")
    parser.add_argument("--timeout-ms", type=int, default=60000, help="Timeout cho mỗi thao tác (ms)")
    parser.add_argument("--output", default="batdongsan_projects.json", help="File JSON đầu ra")
    parser.add_argument("--csv", default="", help="Nếu có, ghi thêm file CSV")
    parser.add_argument("--headed", action="store_true", help="Mở browser có giao diện (mặc định headless)")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    projects = scrape_projects(
        url=args.url,
        max_pages=max(1, args.max_pages),
        timeout_ms=max(5000, args.timeout_ms),
        headless=not args.headed,
    )

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    save_json(projects, output_path)

    if args.csv:
        csv_path = Path(args.csv)
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        save_csv(projects, csv_path)

    print(f"[DONE] Tổng số dự án: {len(projects)}")
    print(f"[DONE] JSON: {output_path}")
    if args.csv:
        print(f"[DONE] CSV: {args.csv}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
