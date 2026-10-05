import { executeCode } from "../services/codeExecutionService.js";


export const runCode = async (req, res) => {

  try {

    const {
      language,
      code,
      input = "",
    } = req.body;


    // Validation

    if (!language) {
      return res.status(400).json({
        message: "Language is required",
      });
    }


    if (!code || !code.trim()) {
      return res.status(400).json({
        message: "Code is required",
      });
    }


    const result = await executeCode({
      language,
      code,
      input,
    });


    res.status(200).json({
      success: true,

      result: {
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        compileOutput: result.compile_output || "",
        status: result.status || null,
        time: result.time || null,
        memory: result.memory || null,
      },
    });

  } catch (error) {

    console.error(
      "CODE EXECUTION ERROR:",
      error.response?.data || error.message
    );


    res.status(500).json({
      success: false,
      message: "Code execution failed",
      error:
        error.response?.data?.error ||
        error.message,
    });
  }
};