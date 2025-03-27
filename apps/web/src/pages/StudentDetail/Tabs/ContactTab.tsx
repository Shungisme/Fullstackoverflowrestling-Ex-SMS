import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/atoms/Card";
import { Student } from "@/src/types";
import { TabsContent } from "@repo/ui";
import { Mail, Phone } from "lucide-react";
import React from "react";

interface ContactTabProps {
    student: Student;
}

const ContactTab = ({student}: ContactTabProps) => {
    return (
        <TabsContent value="contact" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Thông tin liên hệ</CardTitle>
                    <CardDescription>Thông tin liên lạc với sinh viên</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                <Phone size={16} className="text-muted-foreground" />
                                SĐT
                            </h4>
                            <div className="bg-muted p-3 rounded-md">
                                <a
                                    href={`tel:${student.phone}`}
                                    className="text-primary hover:underline"
                                >
                                    {student.phone}
                                </a>
                            </div>
                        </div>

                        {student.email && (
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                                    <Mail size={16} className="text-muted-foreground" />
                                    Email
                                </h4>
                                <div className="bg-muted p-3 rounded-md">
                                    <a
                                        href={`mailto:${student.email}`}
                                        className="text-primary hover:underline break-all"
                                    >
                                        {student.email}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default ContactTab;
