/**
 * 🚀 VIETNAMTRAVEL3D - FIGMA AUTO-DRAFT AUTOMATION SCRIPT
 * -----------------------------------------------------------
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở dự án Figma của bạn trên trình duyệt web (Chrome/Edge/Firefox) theo URL:
 *    https://www.figma.com/files/team/1303276377285335635/project/119724619?fuid=991584774723495098
 * 2. Nhấn F12 để mở Công cụ nhà phát triển (DevTools), chọn tab "Console".
 * 3. Copy toàn bộ đoạn script này và dán (Paste) vào Console, sau đó nhấn Enter.
 * 4. Kịch bản sẽ tự động tạo Trang mới, thiết lập Token màu sắc, dựng khung Layout Desktop,
 *    Sidebar, DetailPanel và cắm các ghim chủ quyền biển đảo Gold tự động!
 */

(async () => {
  console.log("正在启动 VietnamTravel3D Figma Auto-Draft...");

  // Helper tải font chữ an toàn từ Figma API
  async function loadFontSafe(family, style) {
    try {
      await figma.loadFontAsync({ family, style });
      return { family, style };
    } catch (e) {
      console.warn(`Không thể tải font ${family} ${style}, chuyển sang Inter/Arial.`);
      try {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        return { family: "Inter", style: "Regular" };
      } catch (err) {
        return { family: "Arial", style: "Regular" };
      }
    }
  }

  // Tải các font chữ cần thiết
  const fontTitle = await loadFontSafe("Montserrat", "Bold");
  const fontBody = await loadFontSafe("Inter", "Regular");
  const fontBodyBold = await loadFontSafe("Inter", "SemiBold");

  // 1. Khởi tạo Trang Mới trong tệp Figma hiện tại
  const page = figma.createPage();
  page.name = "VietnamTravel3D v2 (Auto-Draft)";
  figma.currentPage = page;

  // 2. Thiết lập Hệ thống Paint Styles (Màu sắc Token)
  function registerPaintStyle(name, r, g, b, opacity = 1.0) {
    const style = figma.createPaintStyle();
    style.name = name;
    style.paints = [{ type: 'SOLID', color: { r: r/255, g: g/255, b: b/255 }, opacity: opacity }];
    return style;
  }

  const colorBgDark = registerPaintStyle("color/bg-dark-deep", 18, 18, 18);
  const colorBgPanel = registerPaintStyle("color/bg-dark-panel", 26, 26, 26, 0.45);
  const colorGold = registerPaintStyle("color/gold", 212, 175, 55);
  const colorEmerald = registerPaintStyle("color/emerald", 9, 121, 105);
  const colorCyan = registerPaintStyle("color/neon-blue", 0, 255, 255);
  const colorBorderGlass = registerPaintStyle("color/border-glass", 255, 255, 255, 0.08);

  // 3. Dựng Main Frame màn hình Desktop (1920x1080)
  const desktopFrame = figma.createFrame();
  desktopFrame.name = "Desktop Overview (1920x1080)";
  desktopFrame.resize(1920, 1080);
  desktopFrame.fills = [{ type: 'SOLID', color: { r: 13/255, g: 13/255, b: 13/255 } }];
  page.appendChild(desktopFrame);

  // 4. Dựng Component Navbar (1920x80)
  const navbar = figma.createFrame();
  navbar.name = "comp/navbar";
  navbar.resize(1920, 80);
  navbar.x = 0;
  navbar.y = 0;
  navbar.fills = [{ type: 'SOLID', color: { r: 26/255, g: 26/255, b: 26/255 }, opacity: 0.70 }];
  navbar.strokes = [{ type: 'SOLID', color: { r: 255/255, g: 255/255, b: 255/255 }, opacity: 0.08 }];
  navbar.strokeAlign = "INSIDE";
  desktopFrame.appendChild(navbar);

  // Logo thương hiệu trong Navbar
  const navLogo = figma.createText();
  navbar.appendChild(navLogo);
  navLogo.fontName = fontTitle;
  navLogo.characters = "VIETNAM TRAVEL 3D";
  navLogo.fontSize = 20;
  navLogo.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  navLogo.x = 32;
  navLogo.y = 28;

  // Cụm Tab chọn Vùng miền trong Navbar
  const tabsContainer = figma.createFrame();
  tabsContainer.name = "Region Selector";
  tabsContainer.resize(600, 48);
  tabsContainer.x = (1920 - 600) / 2;
  tabsContainer.y = 16;
  tabsContainer.fills = [];
  tabsContainer.layoutMode = "HORIZONTAL";
  tabsContainer.primaryAxisSizingMode = "FIXED";
  tabsContainer.counterAxisSizingMode = "AUTO";
  tabsContainer.itemSpacing = 8;
  navbar.appendChild(tabsContainer);

  const regionNames = ["Toàn Quốc", "Bắc Bộ", "Trung Bộ", "Nam Bộ", "Biển Đảo"];
  for (let r of regionNames) {
    const tabBtn = figma.createFrame();
    tabBtn.name = `tab/${r}`;
    tabBtn.layoutMode = "HORIZONTAL";
    tabBtn.paddingLeft = 16;
    tabBtn.paddingRight = 16;
    tabBtn.paddingTop = 8;
    tabBtn.paddingBottom = 8;
    tabBtn.counterAxisSizingMode = "AUTO";
    tabBtn.primaryAxisSizingMode = "AUTO";
    tabBtn.cornerRadius = 6;

    if (r === "Toàn Quốc") {
      tabBtn.fills = [{ type: 'SOLID', color: { r: 9/255, g: 121/255, b: 105/255 } }];
    } else {
      tabBtn.fills = [{ type: 'SOLID', color: { r: 255/255, g: 255/255, b: 255/255 }, opacity: 0.05 }];
    }

    const tabText = figma.createText();
    tabText.fontName = fontBodyBold;
    tabText.characters = r;
    tabText.fontSize = 13;
    if (r === "Toàn Quốc") {
      tabText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    } else {
      tabText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.7 }];
    }
    tabBtn.appendChild(tabText);
    tabsContainer.appendChild(tabBtn);
  }

  // 5. Dựng Sidebar Left Explorer Panel (320x936)
  const sidebarLeft = figma.createFrame();
  sidebarLeft.name = "comp/sidebar-left";
  sidebarLeft.resize(320, 936);
  sidebarLeft.x = 32;
  sidebarLeft.y = 112;
  sidebarLeft.fills = [{ type: 'SOLID', color: { r: 26/255, g: 26/255, b: 26/255 }, opacity: 0.45 }];
  sidebarLeft.strokes = [{ type: 'SOLID', color: { r: 255/255, g: 255/255, b: 255/255 }, opacity: 0.08 }];
  sidebarLeft.cornerRadius = 12;
  desktopFrame.appendChild(sidebarLeft);

  const sidebarHeader = figma.createText();
  sidebarLeft.appendChild(sidebarHeader);
  sidebarHeader.fontName = fontTitle;
  sidebarHeader.characters = "CHỌN VÙNG MIỀN";
  sidebarHeader.fontSize = 14;
  sidebarHeader.fills = [{ type: 'SOLID', color: { r: 212/255, g: 175/255, b: 55/255 } }];
  sidebarHeader.x = 24;
  sidebarHeader.y = 24;

  // 6. Dựng Detail Panel Right (380x936)
  const detailPanelRight = figma.createFrame();
  detailPanelRight.name = "comp/detail-panel-right";
  detailPanelRight.resize(380, 936);
  detailPanelRight.x = 1920 - 380 - 32;
  detailPanelRight.y = 112;
  detailPanelRight.fills = [{ type: 'SOLID', color: { r: 26/255, g: 26/255, b: 26/255 }, opacity: 0.85 }];
  detailPanelRight.strokes = [{ type: 'SOLID', color: { r: 255/255, g: 255/255, b: 255/255 }, opacity: 0.08 }];
  detailPanelRight.cornerRadius = 12;
  desktopFrame.appendChild(detailPanelRight);

  const detailHeader = figma.createText();
  detailPanelRight.appendChild(detailHeader);
  detailHeader.fontName = fontTitle;
  detailHeader.characters = "CHI TIẾT ĐỊA DANH";
  detailHeader.fontSize = 14;
  detailHeader.fills = [{ type: 'SOLID', color: { r: 9/255, g: 121/255, b: 105/255 } }];
  detailHeader.x = 24;
  detailHeader.y = 24;

  // 7. Cắm Ghim Địa Lý Vàng Gold & Cyan Lên Bản Đồ
  const locations = [
    { name: "Hà Nội", x: 960, y: 350, type: "Special" },
    { name: "Đà Nẵng", x: 1080, y: 550, type: "Special" },
    { name: "TP. Hồ Chí Minh", x: 980, y: 800, type: "Special" },
    { name: "QUẦN ĐẢO HOÀNG SA (VN)", x: 1300, y: 500, type: "Special" },
    { name: "QUẦN ĐẢO TRƯỜNG SA (VN)", x: 1350, y: 780, type: "Special" }
  ];

  for (let loc of locations) {
    const pin = figma.createFrame();
    pin.name = `pin/${loc.name}`;
    pin.resize(16, 16);
    pin.x = loc.x;
    pin.y = loc.y;
    pin.cornerRadius = 8;
    pin.fills = [{ type: 'SOLID', color: { r: 212/255, g: 175/255, b: 55/255 } }];
    desktopFrame.appendChild(pin);

    // Hiển thị nhãn tên địa lý bên cạnh ghim
    const label = figma.createText();
    label.fontName = fontBodyBold;
    label.characters = loc.name;
    label.fontSize = 11;
    label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    label.x = loc.x - 40;
    label.y = loc.y + 20;
    desktopFrame.appendChild(label);
  }

  // Tự động cuộn khung nhìn về màn hình vừa tạo
  figma.viewport.scrollAndZoomIntoView([desktopFrame]);

  console.log("🚀 VietnamTravel3D Figma Auto-Draft đã tạo thành công!");
})();
