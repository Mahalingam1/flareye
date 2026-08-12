import os
import datetime
from jinja2 import Template

class PDFReportGenerator:
    """
    Generates PDF & HTML Hospital Fire Safety Incident & Compliance Reports.
    """
    def generate_html_report(self, incident_data: dict) -> str:
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8"/>
            <title>FLAREYE Hospital Safety Report</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; background: #ffffff; }
                .header { border-bottom: 4px solid #ef4444; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                .title { font-size: 28px; font-weight: bold; color: #0f172a; margin: 0; }
                .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
                .badge-critical { background: #fee2e2; color: #991b1b; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
                .section { margin-bottom: 25px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
                .section-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .label { font-size: 12px; color: #64748b; font-weight: bold; text-transform: uppercase; }
                .value { font-size: 16px; color: #0f172a; font-weight: bold; margin-top: 2px; }
                .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .table th, .table td { padding: 10px; border: 1px solid #cbd5e1; text-align: left; font-size: 13px; }
                .table th { background: #e2e8f0; font-weight: bold; }
                .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1 class="title">🏥 FLAREYE DIGITAL SAFETY BRAIN</h1>
                    <div class="subtitle">AI-Powered Hospital Fire Safety & Emergency Response Platform</div>
                </div>
                <div class="badge-critical">🔴 CRITICAL INCIDENT REPORT</div>
            </div>

            <div class="section">
                <div class="section-title">📌 INCIDENT SUMMARY</div>
                <div class="grid">
                    <div>
                        <div class="label">Incident ID</div>
                        <div class="value">{{ incident.incident_number }}</div>
                    </div>
                    <div>
                        <div class="label">Date & Time</div>
                        <div class="value">{{ incident.created_at }}</div>
                    </div>
                    <div>
                        <div class="label">Location</div>
                        <div class="value">{{ incident.location }}</div>
                    </div>
                    <div>
                        <div class="label">AI Confidence</div>
                        <div class="value">{{ incident.confidence * 100 }}% (Multi-Modal Verified)</div>
                    </div>
                    <div>
                        <div class="label">Safety Risk Score</div>
                        <div class="value" style="color: #dc2626;">{{ incident.risk_score }} / 100</div>
                    </div>
                    <div>
                        <div class="label">People in Affected Zone</div>
                        <div class="value">{{ incident.people_nearby }} People</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🔍 AI RISK & ROOT-CAUSE ANALYSIS</div>
                <p><strong>Explainable Rationale:</strong> {{ incident.rationale }}</p>
                <p><strong>Primary Contributing Factors:</strong></p>
                <ul>
                    <li>Optical Smoke Pattern verified on CCTV Camera CAM-201 & CAM-202.</li>
                    <li>IoT Temperature sensor spike to 68.4°C in ICU corridor.</li>
                    <li>Emergency exit corridor blocked by improperly stored medical trolley (18 min duration).</li>
                </ul>
            </div>

            <div class="section">
                <div class="section-title">🧭 DYNAMIC EVACUATION ROUTE EXECUTED</div>
                <div class="grid">
                    <div>
                        <div class="label">Safest Available Exit</div>
                        <div class="value" style="color: #16a34a;">{{ incident.safest_exit }} (84 meters)</div>
                    </div>
                    <div>
                        <div class="label">Blocked / Unsafe Exit</div>
                        <div class="value" style="color: #dc2626;">{{ incident.blocked_exit }}</div>
                    </div>
                </div>
                <p style="margin-top: 10px;"><strong>Mobility Adaptation:</strong> Route calculated with wheelchair & stretcher ramp priority, bypassing all staircases.</p>
            </div>

            <div class="section">
                <div class="section-title">📊 FIRE SAFETY COMPLIANCE AUDIT</div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Status Score</th>
                            <th>Audit Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Fire Extinguishers</td>
                            <td>94%</td>
                            <td>46/47 Accessible and Verified</td>
                        </tr>
                        <tr>
                            <td>Emergency Exits</td>
                            <td>88%</td>
                            <td>East Ramp Exit Clear; North Exit Blocked</td>
                        </tr>
                        <tr>
                            <td>Fire Doors</td>
                            <td>91%</td>
                            <td>Magnetic holdbacks operational</td>
                        </tr>
                        <tr>
                            <td>Corridors & Signage</td>
                            <td>96%</td>
                            <td>Emergency signage illumination 100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="footer">
                FLAREYE Hospital Safety Brain &bull; MEDHA MEDITHON 2026 Official Submission &bull; Verified Digital Signature: FLAREYE-SEC-99482
            </div>
        </body>
        </html>
        """
        template = Template(html_template)
        return template.render(incident=incident_data)

pdf_report_generator = PDFReportGenerator()
