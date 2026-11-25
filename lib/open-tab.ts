/**
 * Points a tab that was opened at click time to `url`.
 * (Browsers only allow a new tab straight after a click, so the tab is opened blank first and
 * sent to Telegram once the order is saved.) If the browser blocked the blank tab, open the link directly.
 */
export function openTab(tab: Window | null, url: string) {
  if (tab) {
    tab.opener = null;
    tab.location.href = url;
  } else {
    window.open(url, "_blank", "noopener");
  }
}