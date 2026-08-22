#!/usr/bin/env python3
"""Generate the downloadable CV used by the portfolio (WEB-092)."""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "assets" / "cv" / "romina-caubarrere-cv.pdf"

INK = HexColor("#27231F")
INK_SOFT = HexColor("#5C554C")
PAPER = HexColor("#EFE8D9")
CREAM = HexColor("#FAF3E4")
GREEN_DARK = HexColor("#183B2B")
GREEN = HexColor("#3F7D4E")
SAGE = HexColor("#788365")
BRICK = HexColor("#A84F36")
GOLD = HexColor("#C59635")
WHITE = HexColor("#FFFFFF")

FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("RomiSans", FONT_DIR / "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("RomiSans-Bold", FONT_DIR / "DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("RomiSerif", FONT_DIR / "DejaVuSerif.ttf"))

STYLES = {
    "body": ParagraphStyle(
        "body", fontName="RomiSans", fontSize=8.2, leading=11.8,
        textColor=INK, alignment=TA_LEFT, spaceAfter=0,
    ),
    "small": ParagraphStyle(
        "small", fontName="RomiSans", fontSize=7.4, leading=10.4,
        textColor=INK_SOFT, alignment=TA_LEFT,
    ),
    "job": ParagraphStyle(
        "job", fontName="RomiSans-Bold", fontSize=9.2, leading=12,
        textColor=GREEN_DARK,
    ),
    "meta": ParagraphStyle(
        "meta", fontName="RomiSans", fontSize=7.2, leading=9.4,
        textColor=BRICK,
    ),
    "sidebar": ParagraphStyle(
        "sidebar", fontName="RomiSans", fontSize=7.5, leading=10.7,
        textColor=CREAM,
    ),
    "sidebar_bold": ParagraphStyle(
        "sidebar_bold", fontName="RomiSans-Bold", fontSize=7.7, leading=10.8,
        textColor=CREAM,
    ),
}


def paragraph(c, text, x, y, width, style="body"):
    item = Paragraph(text, STYLES[style])
    _, height = item.wrap(width, 1000)
    item.drawOn(c, x, y - height)
    return y - height


def section_title(c, text, x, y, width, color=GREEN_DARK):
    c.setFillColor(color)
    c.setFont("RomiSerif", 13)
    c.drawString(x, y, text)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.4)
    c.line(x, y - 5, x + min(width, 42 * mm), y - 5)
    return y - 18


def sidebar_title(c, text, x, y, width):
    c.setFillColor(GOLD)
    c.setFont("RomiSans-Bold", 7.6)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(SAGE)
    c.setLineWidth(0.7)
    c.line(x, y - 4, x + width, y - 4)
    return y - 15


def sidebar_link(c, label, url, x, y):
    c.setFillColor(CREAM)
    c.setFont("RomiSans", 7.5)
    c.drawString(x, y, label)
    label_width = pdfmetrics.stringWidth(label, "RomiSans", 7.5)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(x, y - 2, x + label_width, y - 2)
    c.linkURL(url, (x, y - 3, x + label_width, y + 8), relative=0)
    return y - 13


def stitch_line(c, x, y, width, color=GREEN):
    c.setStrokeColor(color)
    c.setLineWidth(1.1)
    cursor = x
    while cursor < x + width:
        c.arc(cursor, y - 3, cursor + 8, y + 3, 0, 180)
        cursor += 8


def draw_footer(c, page_number):
    width, _ = A4
    c.setStrokeColor(SAGE)
    c.setLineWidth(0.5)
    c.line(18 * mm, 15 * mm, width - 18 * mm, 15 * mm)
    c.setFillColor(INK_SOFT)
    c.setFont("RomiSans", 6.8)
    c.drawString(18 * mm, 9.5 * mm, "Romina Caubarrere - CV actualizado en agosto de 2026")
    c.drawRightString(width - 18 * mm, 9.5 * mm, str(page_number))


def draw_page_one(c):
    width, height = A4
    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    c.setFillColor(GREEN_DARK)
    c.rect(0, height - 46 * mm, width, 46 * mm, fill=1, stroke=0)
    stitch_line(c, 20 * mm, height - 40 * mm, width - 40 * mm, GOLD)

    c.setFillColor(CREAM)
    c.setFont("RomiSerif", 25)
    c.drawString(20 * mm, height - 20 * mm, "Romina Caubarrere")
    c.setFont("RomiSans-Bold", 10)
    c.drawString(20 * mm, height - 29 * mm, "PROJECT MANAGER DE SOFTWARE  |  LICENCIADA EN TECNOLOGÍAS DE LA INFORMACIÓN")
    c.setFont("RomiSans", 8)
    c.setFillColor(HexColor("#D7DDCF"))
    c.drawString(20 * mm, height - 35 * mm, "Personas, producto y tecnología para que los proyectos avancen.")

    sidebar_x = 18 * mm
    sidebar_y = height - 57 * mm
    sidebar_w = 51 * mm
    sidebar_bottom = 22 * mm
    c.setFillColor(GREEN_DARK)
    c.roundRect(sidebar_x, sidebar_bottom, sidebar_w, sidebar_y - sidebar_bottom + 5 * mm, 4 * mm, fill=1, stroke=0)

    sx = sidebar_x + 6 * mm
    sy = sidebar_y - 2 * mm
    sw = sidebar_w - 12 * mm

    sy = sidebar_title(c, "Contacto", sx, sy, sw)
    sy = paragraph(c, "Uruguay", sx, sy, sw, "sidebar") - 3
    sy = sidebar_link(c, "LinkedIn", "https://linkedin.com/in/rominacaubarrere", sx, sy)
    sy = sidebar_link(c, "Portfolio", "https://romicaubarrere.github.io/personal/", sx, sy) - 10

    sy = sidebar_title(c, "Fortalezas", sx, sy, sw)
    for text in (
        "Gestión de proyectos de software",
        "Comunicación y alineación",
        "Producto y requerimientos",
        "Testing y calidad",
        "Scrum y equipos multidisciplinarios",
    ):
        c.setFillColor(GOLD)
        c.circle(sx + 1.5, sy - 3.5, 1.3, fill=1, stroke=0)
        sy = paragraph(c, text, sx + 7, sy, sw - 7, "sidebar") - 2
    sy -= 10

    sy = sidebar_title(c, "Formación", sx, sy, sw)
    sy = paragraph(c, "<b>Licenciatura en Tecnologías de la Información</b><br/>UTEC | 2022-2026", sx, sy, sw, "sidebar") - 8
    sy = paragraph(c, "<b>Diplomatura en Gestión de Proyectos</b><br/>Academia Numen, avalada por PMI | 2024", sx, sy, sw, "sidebar") - 8
    sy = paragraph(c, "<b>Jóvenes a Programar</b><br/>Plan Ceibal | Egresada", sx, sy, sw, "sidebar") - 8
    paragraph(c, "<b>OPI 2.0</b><br/>Formación en oratoria | En curso", sx, sy, sw, "sidebar")

    main_x = 79 * mm
    main_y = height - 57 * mm
    main_w = width - main_x - 18 * mm

    main_y = section_title(c, "Perfil", main_x, main_y, main_w)
    main_y = paragraph(
        c,
        "Project Manager en eagerworks y Licenciada en Tecnologías de la Información por UTEC. "
        "Combino gestión de proyectos de software, producto y calidad con experiencia trabajando "
        "con equipos multidisciplinarios y stakeholders.",
        main_x, main_y, main_w,
    ) - 7
    main_y = paragraph(
        c,
        "También construyo comunidad: soy Women Techmakers Ambassador, embajadora de Chicas en "
        "Tecnología y oradora en espacios vinculados a liderazgo, tecnología y mujeres en STEM.",
        main_x, main_y, main_w,
    ) - 14

    main_y = section_title(c, "Experiencia profesional", main_x, main_y, main_w)
    jobs = [
        (
            "Project Manager | eagerworks",
            "Diciembre 2025 - actualidad",
            "Coordino equipos y stakeholders, facilito la planificación y sigo el progreso y las entregas. "
            "Trabajo para que prioridades, decisiones, riesgos y próximos pasos queden claros.",
        ),
        (
            "Associate Product Manager | UKG",
            "Octubre 2024 - noviembre 2025",
            "Transformé insights y feedback en requerimientos y prioridades de producto junto a equipos "
            "multifuncionales. Participé en el CAB evaluando cambios estratégicos.",
        ),
        (
            "Project Manager Trainee | Plan Ceibal",
            "Junio 2023 - febrero 2024",
            "Planifiqué proyectos y recursos, trabajé sobre alcance y riesgos y seguí varias iniciativas "
            "tecnológicas en simultáneo, alineadas con los objetivos del programa.",
        ),
        (
            "Docente de robótica y programación | Elemental",
            "Octubre 2022 - junio 2023",
            "Di clases con aprendizaje basado en proyectos para acercar la robótica y la programación "
            "en un entorno colaborativo y explicar temas técnicos con claridad.",
        ),
    ]
    for title, dates, description in jobs:
        main_y = paragraph(c, title, main_x, main_y, main_w, "job")
        main_y = paragraph(c, dates, main_x, main_y - 1, main_w, "meta")
        main_y = paragraph(c, description, main_x, main_y - 3, main_w, "small") - 10

    main_y = section_title(c, "Desarrollo profesional", main_x, main_y, main_w)
    main_y = paragraph(c, "<b>Programa de Mentoring PMI 2026</b> | Mentee", main_x, main_y, main_w, "body")
    paragraph(c, "Experiencia de acompañamiento y desarrollo profesional separada de los cargos laborales.", main_x, main_y - 3, main_w, "small")

    draw_footer(c, 1)
    c.showPage()


def item_block(c, title, meta, description, x, y, width, accent=GREEN):
    c.setFillColor(accent)
    c.circle(x + 2, y - 4, 2, fill=1, stroke=0)
    y = paragraph(c, title, x + 10, y, width - 10, "job")
    if meta:
        y = paragraph(c, meta, x + 10, y - 1, width - 10, "meta")
    y = paragraph(c, description, x + 10, y - 3, width - 10, "small")
    return y - 11


def draw_page_two(c):
    width, height = A4
    c.setFillColor(CREAM)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(GREEN_DARK)
    c.rect(0, height - 25 * mm, width, 25 * mm, fill=1, stroke=0)
    c.setFillColor(CREAM)
    c.setFont("RomiSerif", 18)
    c.drawString(18 * mm, height - 15 * mm, "Proyectos, comunidad y aprendizaje continuo")
    stitch_line(c, 18 * mm, height - 21 * mm, width - 36 * mm, GOLD)

    gap = 13 * mm
    col_w = (width - 36 * mm - gap) / 2
    left_x = 18 * mm
    right_x = left_x + col_w + gap
    top = height - 36 * mm

    y = section_title(c, "Proyectos destacados", left_x, top, col_w)
    y = item_block(
        c, "habITar | Proyecto final UTEC", "Producto, gestión y calidad",
        "Durante 46 semanas, un equipo de tres personas desarrolló una plataforma para centralizar la "
        "gestión de una cooperativa de vivienda. Mi foco estuvo en producto, gestión y testing: 63 "
        "requerimientos must have, 226 casos manuales y más de 2700 pruebas automatizadas.",
        left_x, y, col_w, GREEN,
    )
    y = item_block(
        c, "Física Mente Posible", "Divulgación científica",
        "Proyecto de divulgación de la Física que cofundé y presenté en el ciclo Mujeres en ciencia y "
        "tecnología de OMEU.",
        left_x, y, col_w, BRICK,
    )
    y = item_block(
        c, "MetaConnect", "Innovación y presentación",
        "Proyecto presentado en la gala de clausura del LPF Hackathon de PMI Andes Patagonia.",
        left_x, y, col_w, GOLD,
    )

    y -= 3
    y = section_title(c, "Liderazgo y comunidad", left_x, y, col_w)
    leadership = [
        "Women Techmakers Ambassador | 2023 - actualidad",
        "Embajadora de Chicas en Tecnología | 2026 - actualidad",
        "VP de Alianzas, Club de Jóvenes Líderes PMI Nuevo Cuyo | 2022-2023",
        "Voluntaria y retromentora, Líderes del Presente y del Futuro | PMI / PMIEF",
    ]
    for text in leadership:
        c.setFillColor(SAGE)
        c.circle(left_x + 2, y - 4, 1.6, fill=1, stroke=0)
        y = paragraph(c, text, left_x + 9, y, col_w - 9, "small") - 6

    y = section_title(c, "Certificaciones seleccionadas", right_x, top, col_w)
    certifications = [
        "Google Cloud Cybersecurity Certificate | Google, 2025",
        "AWS Academy Graduate - Cloud Foundations | AWS, 2025",
        "Product-led Certification y Pendo Essentials for Web | Pendo",
        "Google Project Management | Google",
        "Scrum Master | LearnQuest",
        "Git y GitHub | IBM",
    ]
    for text in certifications:
        c.setFillColor(GOLD)
        c.circle(right_x + 2, y - 4, 1.6, fill=1, stroke=0)
        y = paragraph(c, text, right_x + 9, y, col_w - 9, "small") - 6

    y -= 6
    y = section_title(c, "Charlas y paneles", right_x, y, col_w)
    talks = [
        ("Break the Pattern", "Panelista | Women Techmakers Uruguay y UCU | 2026"),
        ("Mujeres en Tech", "Panelista | Campus Party Uruguay | 2025"),
        ("El rol de liderazgo de las mujeres en STEM", "Oradora | Foro de Mujeres Emprendedoras"),
        ("End-to-End: Ser mujer en un rol tech", "Panelista | Comunidades tech de Uruguay"),
        ("Ciberseguridad para estudiantes", "Oradora | Colegio y Liceo Pablo Neruda, Atlántida"),
    ]
    for title, meta in talks:
        y = paragraph(c, title, right_x, y, col_w, "job")
        y = paragraph(c, meta, right_x, y - 1, col_w, "meta") - 9

    y -= 5
    y = section_title(c, "Idiomas", right_x, y, col_w)
    paragraph(c, "Español nativo | Inglés C2", right_x, y, col_w, "body")

    draw_footer(c, 2)
    c.save()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    pdf.setTitle("CV - Romina Caubarrere")
    pdf.setAuthor("Romina Caubarrere")
    pdf.setSubject("Project Manager de software")
    draw_page_one(pdf)
    draw_page_two(pdf)
    print(OUTPUT)


if __name__ == "__main__":
    main()
