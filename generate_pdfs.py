import json
import os
import glob
from PyPDF2 import PdfMerger, PdfReader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors

SOURCE_DIR = r"C:\Users\sures\OneDrive\Documents\Downloads\2ndSem QP and Scheme"
OUTPUT_DIR = r"C:\Users\sures\Downloads\valuation-camp-2\Examiner_Handbooks"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

from reportlab.platypus import Table, TableStyle

def create_cover_page(examiner_name, chief_name, papers, output_path):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # Border
    c.setStrokeColor(colors.black)
    c.setLineWidth(2)
    c.rect(0.5 * inch, 0.5 * inch, width - 1 * inch, height - 1 * inch)

    # Title
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2.0, height - 2 * inch, "Valuation Camp Handbook")
    
    # Examiner Name
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2.0, height - 2.8 * inch, f"Examiner: {examiner_name}")
    
    # Chief Name
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2.0, height - 3.2 * inch, f"(Chief Examiner: {chief_name})")
    
    # Summary of Allocations Table
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2.0, height - 4 * inch, "Valuation Allocations")
    
    # Table Data
    data = [["Bundle #", "Session", "Paper Name", "QP Code", "Scripts", "False Nos"]]
    for p in papers:
        # Wrap paper name if too long or just truncate
        paper_name = p['paperName']
        if len(paper_name) > 30:
            paper_name = paper_name[:27] + "..."
            
        data.append([
            f"#{p['serial']}",
            p['session'],
            paper_name,
            p['qp'],
            str(p['count']),
            f"{p['start']} - {p['end']}"
        ])
        
    # Create Table
    table = Table(data, colWidths=[0.8 * inch, 1.2 * inch, 2.3 * inch, 0.8 * inch, 0.7 * inch, 1.4 * inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('ALIGN', (0, 1), (-1, -1), 'CENTER'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'), # Paper name left aligned
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    # Alternate row colors
    for i in range(1, len(data)):
        if i % 2 == 0:
            table.setStyle(TableStyle([('BACKGROUND', (0, i), (-1, i), colors.lightgrey)]))
        else:
            table.setStyle(TableStyle([('BACKGROUND', (0, i), (-1, i), colors.white)]))
            
    # Calculate position and draw
    table.wrapOn(c, width, height)
    t_width, t_height = table.wrap(0, 0)
    
    x_pos = (width - t_width) / 2.0
    y_pos = height - 4.5 * inch - t_height
    
    table.drawOn(c, x_pos, y_pos)
            
    c.save()

def find_pdf(qp_code, type_str):
    pattern = os.path.join(SOURCE_DIR, f"{qp_code}_{type_str}_*.pdf")
    matches = glob.glob(pattern)
    return matches[0] if matches else None

def generate_handbooks():
    with open("examiner_data.json", "r") as f:
        examiners = json.load(f)
        
    for examiner, data in examiners.items():
        print(f"Generating handbook for {examiner}...")
        safe_name = examiner.replace(" ", "_").replace(".", "")
        cover_path = f"temp_cover_{safe_name}.pdf"
        
        # 1. Create Cover Page
        create_cover_page(examiner, data['chief'], data['papers'], cover_path)
        
        # 2. Merge PDFs
        merger = PdfMerger()
        merger.append(cover_path)
        
        # Determine unique QPs and order them
        unique_qps = []
        for p in data['papers']:
            if p['qp'] not in unique_qps:
                unique_qps.append(p['qp'])
                
        for qp in unique_qps:
            # Question Paper First
            qp_pdf = find_pdf(qp, "qp")
            if qp_pdf:
                merger.append(qp_pdf)
            else:
                print(f"  Warning: QP PDF not found for {qp}")
                
            # Then Scheme
            scheme_pdf = find_pdf(qp, "scheme")
            if scheme_pdf:
                merger.append(scheme_pdf)
            else:
                print(f"  Warning: Scheme PDF not found for {qp}")
                
        output_file = os.path.join(OUTPUT_DIR, f"{safe_name}_Handbook.pdf")
        with open(output_file, "wb") as f_out:
            merger.write(f_out)
            
        merger.close()
        os.remove(cover_path)
        print(f"  Saved: {output_file}")

if __name__ == "__main__":
    generate_handbooks()
    print("Done!")
